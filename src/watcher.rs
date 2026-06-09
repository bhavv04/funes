use crate::chunker;
use crate::config::Config;
use crate::embedder::Embedder;
use crate::store::{Chunk, Store};
use anyhow::Result;
use notify::{Event, EventKind, RecommendedWatcher, RecursiveMode, Watcher};
use std::path::PathBuf;
use std::sync::mpsc;
use std::time::{Duration, SystemTime, UNIX_EPOCH};
use uuid::Uuid;

pub struct FileWatcher {
    config: Config,
}

impl FileWatcher {
    pub fn new(config: Config) -> Self {
        FileWatcher { config }
    }

    pub async fn run(&self) -> Result<()> {
        let store = Store::new(&crate::config::db_path())?;
        let embedder = Embedder::new(
            &self.config.embedder.endpoint,
            &self.config.embedder.model,
        );

        let (tx, rx) = mpsc::channel::<notify::Result<Event>>();

        let mut watcher = RecommendedWatcher::new(tx, notify::Config::default())?;

        if self.config.core.watch_dirs.is_empty() {
            println!("no watch dirs configured. add one with: funes watch <path>");
            return Ok(());
        }

        for dir in &self.config.core.watch_dirs {
            let expanded = expand_path(dir);
            if expanded.exists() {
                watcher.watch(&expanded, RecursiveMode::Recursive)?;
                println!("watching: {}", expanded.display());
            } else {
                println!("skipping (not found): {}", expanded.display());
            }
        }

        println!("funes watcher running. press ctrl+c to stop.");

        for res in rx {
            match res {
                Ok(event) => {
                    if should_process(&event) {
                        for path in &event.paths {
                            if is_indexable(path) && !is_excluded(path, &self.config.core.exclude) {
                                if let Err(e) = index_file(path, &store, &embedder).await {
                                    eprintln!("error indexing {:?}: {}", path, e);
                                }
                            }
                        }
                    }
                }
                Err(e) => eprintln!("watch error: {}", e),
            }
        }

        Ok(())
    }
}

fn should_process(event: &Event) -> bool {
    matches!(
        event.kind,
        EventKind::Create(_) | EventKind::Modify(_)
    )
}

fn is_indexable(path: &PathBuf) -> bool {
    let ext = path.extension()
        .and_then(|e| e.to_str())
        .unwrap_or("");

    matches!(
        ext,
        "rs" | "py" | "js" | "ts" | "go" | "md" |
        "txt" | "toml" | "yaml" | "yml" | "json" |
        "c" | "cpp" | "h" | "sh" | "fish"
    )
}

fn is_excluded(path: &PathBuf, exclude: &[String]) -> bool {
    let path_str = path.to_string_lossy();
    exclude.iter().any(|pattern| {
        if pattern.starts_with('*') {
            path_str.ends_with(&pattern[1..])
        } else {
            path_str.contains(pattern.as_str())
        }
    })
}

async fn index_file(
    path: &PathBuf,
    store: &Store,
    embedder: &Embedder,
) -> Result<()> {
    let content = std::fs::read_to_string(path)?;
    let chunks = chunker::chunk_file(path, &content);

    if chunks.is_empty() {
        return Ok(());
    }

    // remove old chunks for this file before reindexing
    store.delete_by_path(&path.to_string_lossy())?;

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)?
        .as_secs() as i64;

    println!("indexing: {} ({} chunks)", path.display(), chunks.len());

    for chunk in &chunks {
        let embedding = embedder.embed(&chunk.content).await?;
        let stored = Chunk {
            id: Uuid::new_v4().to_string(),
            source_path: path.to_string_lossy().to_string(),
            content: chunk.content.clone(),
            embedding,
            timestamp,
            chunk_type: chunk.chunk_type.clone(),
        };
        store.insert(&stored)?;
    }

    Ok(())
}

pub fn expand_path(path: &str) -> PathBuf {
    if path.starts_with("~/") {
        if let Some(home) = dirs::home_dir() {
            return home.join(&path[2..]);
        }
    }
    PathBuf::from(path)
}