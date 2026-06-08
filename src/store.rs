use anyhow::Result;
use rusqlite::{params, Connection};
use serde::{Deserialize, Serialize};
use std::path::Path;

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

        Ok(Store { conn })
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