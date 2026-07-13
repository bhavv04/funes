mod config;
mod embedder;
mod store;
mod chunker;
mod watcher;
mod daemon;
mod query;

use anyhow::Result;
use clap::{Parser, Subcommand};
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};
use uuid::Uuid;

#[derive(Parser)]
#[command(name = "funes")]
#[command(about = "Your machine's memory, queryable")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Start the daemon
    Start,
    /// Stop the daemon
    Stop,
    /// Show daemon status
    Status,
    /// Manually index a file or folder
    Add { path: String },
    /// Query your memory
    Query {
        question: String,
        #[arg(long)]
        llm: bool,
        #[arg(long)]
        json: bool,
    },
    /// Show config path
    Config,

    /// Add a directory to watch
    Watch { path: String },
    /// Remove a directory from watch list
    Unwatch { path: String },
    /// Reindex everything
    Reindex,
    /// Exclude a file pattern
    Forget { pattern: String },

    /// Index shell history
    IndexHistory,
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();
    let config = config::Config::load()?;
    let db_path = config::db_path();
    let store = store::Store::new(&db_path)?;
    let embedder = embedder::Embedder::new(
        &config.embedder.endpoint,
        &config.embedder.model,
    );

    match cli.command {
        Commands::Start => {
            println!("starting funes...");
            let watcher = watcher::FileWatcher::new(config);
            watcher.run().await?;
        }
        Commands::Stop => println!("Stopping funes daemon..."),

        Commands::Status => {
            let count = store.count()?;
            println!("funes is running");
            println!("indexed chunks : {}", count);
            println!("db             : {:?}", db_path);
            println!("watching       : {} dirs", config.core.watch_dirs.len());
            for dir in &config.core.watch_dirs {
                println!("  - {}", dir);
            }
        }

        Commands::Add { path } => {
            let path = PathBuf::from(&path);
            if path.is_dir() {
                index_dir(&path, &store, &embedder, &config).await?;
            } else {
                index_file(&path, &store, &embedder).await?;
            }
        }

        Commands::Query { question, llm, json } => {
            let query_embedding = embedder.embed(&question).await?;
            let all_chunks = store.get_all()?;

            if all_chunks.is_empty() {
                println!("nothing indexed yet. run: funes add <path>");
                return Ok(());
            }

            let mut scored: Vec<(f32, &store::Chunk)> = all_chunks
                .iter()
                .map(|chunk| {
                    let score = embedder::Embedder::cosine_similarity(
                        &query_embedding,
                        &chunk.embedding,
                    );
                    (score, chunk)
                })
                .collect();

            scored.sort_by(|a, b| b.0.partial_cmp(&a.0).unwrap());
            let top: Vec<(f32, &store::Chunk)> = scored.into_iter().take(5).collect();

            if llm {
                println!("thinking...\n");
                let chunks_for_llm: Vec<(f32, String, String)> = top
                    .iter()
                    .map(|(score, chunk)| {
                        (*score, chunk.source_path.clone(), chunk.content.clone())
                    })
                    .collect();

                match query::synthesize(
                    &question,
                    &chunks_for_llm,
                    &config.llm.endpoint,
                    &config.llm.model,
                )
                .await
                {
                    Ok(answer) => println!("{}", answer),
                    Err(e) => eprintln!("llm error: {}", e),
                }
            } else if json {
                let results: Vec<serde_json::Value> = top.iter().map(|(score, chunk)| {
                    serde_json::json!({
                        "score": score,
                        "path": chunk.source_path,
                        "content": chunk.content,
                        "type": chunk.chunk_type,
                    })
                }).collect();
                println!("{}", serde_json::to_string_pretty(&results)?);
            } else {
                println!("\ntop results for: \"{}\"\n", question);
                for (i, (score, chunk)) in top.iter().enumerate() {
                    println!("{}. [score: {:.3}] {}", i + 1, score, chunk.source_path);
                    println!("   type: {}", chunk.chunk_type);
                    println!("   {}", truncate(&chunk.content, 120));
                    println!();
                }
            }
        }

        Commands::Config => {
            println!("config: {:?}", config::config_path());
        }

        Commands::Watch { path } => {
            let expanded = watcher::expand_path(&path);
            let expanded_str = expanded.to_string_lossy().to_string();

            if config.core.watch_dirs.contains(&expanded_str) {
                println!("already watching: {}", expanded_str);
            } else {
                let mut updated = config.clone();
                updated.core.watch_dirs.push(expanded_str.clone());
                updated.save()?;
                println!("added to watch list: {}", expanded_str);
                println!("run 'funes start' to begin watching");
            }
        }

        Commands::Unwatch { path } => {
            let expanded = watcher::expand_path(&path);
            let expanded_str = expanded.to_string_lossy().to_string();
            let mut updated = config.clone();
            let before = updated.core.watch_dirs.len();
            updated.core.watch_dirs.retain(|d| d != &expanded_str);

            if updated.core.watch_dirs.len() == before {
                println!("not in watch list: {}", expanded_str);
            } else {
                updated.save()?;
                println!("removed from watch list: {}", expanded_str);
            }
        }

        Commands::Reindex => {
            println!("clearing index...");
            store.clear()?;
            let dirs = config.core.watch_dirs.clone();
            if dirs.is_empty() {
                println!("no watch dirs configured. use: funes watch <path>");
                return Ok(());
            }
            for dir in &dirs {
                let path = watcher::expand_path(dir);
                if path.exists() {
                    index_dir(&path, &store, &embedder, &config).await?;
                }
            }
            println!("reindex complete. total chunks: {}", store.count()?);
        }

        Commands::Forget { pattern } => {
            if config.core.exclude.contains(&pattern) {
                println!("already excluded: {}", pattern);
            } else {
                let mut updated = config.clone();
                updated.core.exclude.push(pattern.clone());
                updated.save()?;
                println!("added exclusion rule: {}", pattern);
            }
        }

        Commands::IndexHistory => {
            println!("indexing shell history...");
            let count = watcher::index_shell_history(&store, &embedder).await?;
            println!("indexed {} commands", count);
        }
    }

    Ok(())
}

async fn index_file(
    path: &PathBuf,
    store: &store::Store,
    embedder: &embedder::Embedder,
) -> Result<()> {
    let content = std::fs::read_to_string(path)?;
    let chunks = chunker::chunk_file(path, &content);

    if chunks.is_empty() {
        println!("No chunks found in {:?}", path);
        return Ok(());
    }

    println!("Indexing {:?} - {} chunks", path, chunks.len());

    let timestamp = SystemTime::now()
        .duration_since(UNIX_EPOCH)?
        .as_secs() as i64;

    for (i, chunk) in chunks.iter().enumerate() {
        let embedding = embedder.embed(&chunk.content).await?;
        let stored = store::Chunk {
            id: Uuid::new_v4().to_string(),
            source_path: path.to_string_lossy().to_string(),
            content: chunk.content.clone(),
            embedding,
            timestamp,
            chunk_type: chunk.chunk_type.clone(),
        };
        store.insert(&stored)?;
        print!("\r  chunk {}/{}", i + 1, chunks.len());
    }

    println!("\n  done.");
    Ok(())
}

async fn index_dir(
    dir: &PathBuf,
    store: &store::Store,
    embedder: &embedder::Embedder,
    config: &config::Config,
) -> Result<()> {
    let entries = walkdir(dir, &config.core.exclude);
    println!("Found {} files in {:?}", entries.len(), dir);

    for path in entries {
        if let Err(e) = index_file(&path, store, embedder).await {
            println!("  skipping {:?}: {}", path, e);
        }
    }

    Ok(())
}

fn walkdir(dir: &PathBuf, exclude: &[String]) -> Vec<PathBuf> {
    let mut results = Vec::new();

    let Ok(entries) = std::fs::read_dir(dir) else {
        return results;
    };

    for entry in entries.flatten() {
        let path = entry.path();
        let name = path.file_name()
            .and_then(|n| n.to_str())
            .unwrap_or("");

        if exclude.iter().any(|e| glob_match(e, name)) {
            continue;
        }

        if path.is_dir() {
            results.extend(walkdir(&path, exclude));
        } else if is_indexable(&path) {
            results.push(path);
        }
    }

    results
}

fn is_indexable(path: &PathBuf) -> bool {
    let ext = path.extension()
        .and_then(|e| e.to_str())
        .unwrap_or("");

    matches!(ext, "rs" | "py" | "js" | "ts" | "go" | "md" |
                  "txt" | "toml" | "yaml" | "yml" | "json" |
                  "c" | "cpp" | "h" | "sh" | "fish")
}

fn glob_match(pattern: &str, name: &str) -> bool {
    if pattern.starts_with('*') {
        name.ends_with(&pattern[1..])
    } else {
        name == pattern
    }
}

fn truncate(s: &str, max: usize) -> String {
    let s = s.replace('\n', " ");
    if s.len() <= max {
        s
    } else {
        format!("{}...", &s[..max])
    }
}// test comment
