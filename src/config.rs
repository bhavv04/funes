use anyhow::Result;
use dirs::home_dir;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct CoreConfig {
    pub watch_dirs: Vec<String>,
    pub exclude: Vec<String>,
    pub auto_start: bool,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct EmbedderConfig {
    pub provider: String,
    pub model: String,
    pub endpoint: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct LlmConfig {
    pub provider: String,
    pub model: String,
    pub endpoint: String,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct StoreConfig {
    pub path: String,
    pub max_size_gb: u64,
}

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct Config {
    pub core: CoreConfig,
    pub embedder: EmbedderConfig,
    pub llm: LlmConfig,
    pub store: StoreConfig,
}

impl Config {
    pub fn load() -> Result<Self> {
        let path = config_path();

        if !path.exists() {
            let default = Config::default();
            default.save()?;
            return Ok(default);
        }

        let contents = fs::read_to_string(&path)?;
        let config: Config = toml::from_str(&contents)?;
        Ok(config)
    }

    pub fn save(&self) -> Result<()> {
        let path = config_path();
        if let Some(parent) = path.parent() {
            fs::create_dir_all(parent)?;
        }
        let contents = toml::to_string_pretty(self)?;
        fs::write(&path, contents)?;
        Ok(())
    }
}

impl Default for Config {
    fn default() -> Self {
        Config {
            core: CoreConfig {
                watch_dirs: vec![],
                exclude: vec![
                    "*.env".into(),
                    "*.secret".into(),
                    "node_modules".into(),
                    ".git".into(),
                    "target".into(),
                ],
                auto_start: false,
            },
            embedder: EmbedderConfig {
                provider: "ollama".into(),
                model: "nomic-embed-text".into(),
                endpoint: "http://localhost:11434".into(),
            },
            llm: LlmConfig {
                provider: "ollama".into(),
                model: "llama3".into(),
                endpoint: "http://localhost:11434".into(),
            },
            store: StoreConfig {
                path: "~/.funes/db".into(),
                max_size_gb: 5,
            },
        }
    }
}

pub fn funes_dir() -> PathBuf {
    home_dir().unwrap_or_else(|| PathBuf::from(".")).join(".funes")
}

pub fn config_path() -> PathBuf {
    funes_dir().join("config.toml")
}

pub fn db_path() -> PathBuf {
    funes_dir().join("funes.db")
}