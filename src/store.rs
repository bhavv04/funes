use anyhow::Result;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::path::{Path, PathBuf};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Chunk {
    pub id: String,
    pub source_path: String,
    pub content: String,
    pub embedding: Vec<f32>,
    pub timestamp: i64,
    pub chunk_type: String,
}

pub struct Store {
    conn: Connection,
    pub path: PathBuf,
}

impl Store {
    pub fn new(db_path: &Path) -> Result<Self> {
        if let Some(parent) = db_path.parent() {
            std::fs::create_dir_all(parent)?;
        }

        let conn = Connection::open(db_path)?;

        conn.execute_batch("
            CREATE TABLE IF NOT EXISTS chunks (
                id TEXT PRIMARY KEY,
                source_path TEXT NOT NULL,
                content TEXT NOT NULL,
                embedding TEXT NOT NULL,
                timestamp INTEGER NOT NULL,
                chunk_type TEXT NOT NULL
            );
            CREATE INDEX IF NOT EXISTS idx_source_path ON chunks(source_path);
            CREATE INDEX IF NOT EXISTS idx_timestamp ON chunks(timestamp);
        ")?;

        Ok(Store { conn, path: db_path.to_path_buf() })
    }

    pub fn insert(&self, chunk: &Chunk) -> Result<()> {
        let embedding_json = serde_json::to_string(&chunk.embedding)?;

        self.conn.execute(
            "INSERT OR REPLACE INTO chunks
             (id, source_path, content, embedding, timestamp, chunk_type)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
            params![
                chunk.id,
                chunk.source_path,
                chunk.content,
                embedding_json,
                chunk.timestamp,
                chunk.chunk_type,
            ],
        )?;

        Ok(())
    }

    pub fn get_all(&self) -> Result<Vec<Chunk>> {
        let mut stmt = self.conn.prepare(
            "SELECT id, source_path, content, embedding, timestamp, chunk_type
             FROM chunks"
        )?;

        let chunks = stmt.query_map([], |row| {
            Ok((
                row.get::<_, String>(0)?,
                row.get::<_, String>(1)?,
                row.get::<_, String>(2)?,
                row.get::<_, String>(3)?,
                row.get::<_, i64>(4)?,
                row.get::<_, String>(5)?,
            ))
        })?
        .filter_map(|r| r.ok())
        .filter_map(|(id, source_path, content, embedding_json, timestamp, chunk_type)| {
            let embedding: Vec<f32> = serde_json::from_str(&embedding_json).ok()?;
            Some(Chunk { id, source_path, content, embedding, timestamp, chunk_type })
        })
        .collect();

        Ok(chunks)
    }

    pub fn delete_by_path(&self, path: &str) -> Result<()> {
        self.conn.execute(
            "DELETE FROM chunks WHERE source_path = ?1",
            params![path],
        )?;
        Ok(())
    }

    pub fn count(&self) -> Result<i64> {
        let count: i64 = self.conn.query_row(
            "SELECT COUNT(*) FROM chunks",
            [],
            |row| row.get(0),
        )?;
        Ok(count)
    }

    pub fn clear(&self) -> Result<()> {
        self.conn.execute_batch("DELETE FROM chunks;")?;
        Ok(())
    }
}   

#[cfg(test)]
mod tests {
    use super::*;
    use std::path::PathBuf;

    fn temp_store() -> Store {
        let path = PathBuf::from(format!(
            "test_{}.db",
            uuid::Uuid::new_v4()
        ));
        Store::new(&path).unwrap()
    }

    fn cleanup(store: &Store) {
        let path = store.path.clone();
        drop(store);
        let _ = std::fs::remove_file(path);
    }

    #[test]
    fn test_insert_and_count() {
        let store = temp_store();
        let chunk = Chunk {
            id: "test-1".to_string(),
            source_path: "/test/file.rs".to_string(),
            content: "fn main() {}".to_string(),
            embedding: vec![0.1, 0.2, 0.3],
            timestamp: 0,
            chunk_type: "code".to_string(),
        };
        store.insert(&chunk).unwrap();
        assert_eq!(store.count().unwrap(), 1);
    }

    #[test]
    fn test_get_all_returns_inserted() {
        let store = temp_store();
        let chunk = Chunk {
            id: "test-2".to_string(),
            source_path: "/test/file.md".to_string(),
            content: "hello world".to_string(),
            embedding: vec![0.5, 0.5],
            timestamp: 0,
            chunk_type: "markdown".to_string(),
        };
        store.insert(&chunk).unwrap();
        let all = store.get_all().unwrap();
        assert_eq!(all.len(), 1);
        assert_eq!(all[0].content, "hello world");
    }

    #[test]
    fn test_delete_by_path() {
        let store = temp_store();
        let chunk = Chunk {
            id: "test-3".to_string(),
            source_path: "/test/delete.rs".to_string(),
            content: "to be deleted".to_string(),
            embedding: vec![0.1],
            timestamp: 0,
            chunk_type: "code".to_string(),
        };
        store.insert(&chunk).unwrap();
        assert_eq!(store.count().unwrap(), 1);
        store.delete_by_path("/test/delete.rs").unwrap();
        assert_eq!(store.count().unwrap(), 0);
    }

    #[test]
    fn test_clear() {
        let store = temp_store();
        for i in 0..5 {
            let chunk = Chunk {
                id: format!("test-{}", i),
                source_path: "/test/file.rs".to_string(),
                content: format!("content {}", i),
                embedding: vec![0.1],
                timestamp: 0,
                chunk_type: "code".to_string(),
            };
            store.insert(&chunk).unwrap();
        }
        assert_eq!(store.count().unwrap(), 5);
        store.clear().unwrap();
        assert_eq!(store.count().unwrap(), 0);
    }

    #[test]
    fn test_insert_or_replace() {
        let store = temp_store();
        let chunk = Chunk {
            id: "same-id".to_string(),
            source_path: "/test/file.rs".to_string(),
            content: "original".to_string(),
            embedding: vec![0.1],
            timestamp: 0,
            chunk_type: "code".to_string(),
        };
        store.insert(&chunk).unwrap();
        let updated = Chunk {
            id: "same-id".to_string(),
            content: "updated".to_string(),
            ..chunk
        };
        store.insert(&updated).unwrap();
        assert_eq!(store.count().unwrap(), 1);
        assert_eq!(store.get_all().unwrap()[0].content, "updated");
    }
}