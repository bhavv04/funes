mod config;
mod embedder;
mod store;
mod chunker;
mod watcher;
mod daemon;
mod query;

use anyhow::Result;
use clap::{Parser, Subcommand};

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
    /// Show and edit config
    Config,
}

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();
    let config = config::Config::load()?;

    match cli.command {
        Commands::Start => println!("Starting funes daemon..."),
        Commands::Stop => println!("Stopping funes daemon..."),
        Commands::Status => println!("funes status: running"),
        Commands::Add { path } => println!("Indexing: {}", path),
        Commands::Query { question, llm, json } => {
            println!("Querying: {} (llm={}, json={})", question, llm, json);
        }
        Commands::Config => {
            println!("Config loaded from: {:?}", config::config_path());
        }
    }

    Ok(())
}