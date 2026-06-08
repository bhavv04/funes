use std::path::Path;

pub struct Chunk {
    pub content: String,
    pub chunk_type: String,
}

pub fn chunk_file(path: &Path, content: &str) -> Vec<Chunk> {
    let ext = path.extension()
        .and_then(|e| e.to_str())
        .unwrap_or("");

    match ext {
        "rs" | "py" | "js" | "ts" | "go" | "c" | "cpp" => chunk_code(content),
        "md" | "txt" | "mdx" => chunk_markdown(content),
        "toml" | "yaml" | "yml" | "json" => chunk_config(content),
        _ => chunk_plaintext(content),
    }
}

// code files — split by double newline (roughly by function/block)
fn chunk_code(content: &str) -> Vec<Chunk> {
    content
        .split("\n\n")
        .map(|s| s.trim())
        .filter(|s| !s.is_empty() && s.len() > 30)
        .map(|s| Chunk {
            content: s.to_string(),
            chunk_type: "code".to_string(),
        })
        .collect()
}

// markdown — split by heading or double newline
fn chunk_markdown(content: &str) -> Vec<Chunk> {
    let mut chunks = Vec::new();
    let mut current = String::new();

    for line in content.lines() {
        if line.starts_with('#') && !current.trim().is_empty() {
            chunks.push(Chunk {
                content: current.trim().to_string(),
                chunk_type: "markdown".to_string(),
            });
            current = String::new();
        }
        current.push_str(line);
        current.push('\n');
    }

    if !current.trim().is_empty() {
        chunks.push(Chunk {
            content: current.trim().to_string(),
            chunk_type: "markdown".to_string(),
        });
    }

    chunks.into_iter().filter(|c| c.content.len() > 30).collect()
}

// config files — treat whole file as one chunk
fn chunk_config(content: &str) -> Vec<Chunk> {
    if content.trim().is_empty() {
        return vec![];
    }
    vec![Chunk {
        content: content.trim().to_string(),
        chunk_type: "config".to_string(),
    }]
}

// fallback — split by paragraph
fn chunk_plaintext(content: &str) -> Vec<Chunk> {
    content
        .split("\n\n")
        .map(|s| s.trim())
        .filter(|s| !s.is_empty() && s.len() > 30)
        .map(|s| Chunk {
            content: s.to_string(),
            chunk_type: "text".to_string(),
        })
        .collect()
}

// shell history — one command per chunk
pub fn chunk_shell_history(content: &str) -> Vec<Chunk> {
    content
        .lines()
        .map(|s| s.trim())
        .filter(|s| !s.is_empty() && !s.starts_with('#'))
        .map(|s| Chunk {
            content: s.to_string(),
            chunk_type: "shell".to_string(),
        })
        .collect()
}