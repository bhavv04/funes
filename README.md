# funes

> your machine's memory, queryable.

[![crates.io](https://img.shields.io/crates/v/funes-memory.svg)](https://crates.io/crates/funes-memory)
[![license](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![build](https://img.shields.io/github/actions/workflow/status/bhavv04/funes/ci.yml)](https://github.com/bhavv04/funes/actions)

funes is a local AI memory daemon for the terminal. it indexes your files, notes, and shell history into a local vector database and lets you search everything with natural language, no cloud, no accounts, your data never leaves your machine.

<!-- demo gif goes here -->

---

## features

- **semantic search** — find anything by meaning, not just keywords
- **shell history indexing** — query your bash, zsh, fish, and PowerShell history
- **file watcher** — automatically reindexes files as you work
- **llm synthesis** — get plain English answers from your own content via `--llm`
- **fully local** — powered by Ollama, zero network calls to external servers
- **fast** — 85ms average query latency across 3,400+ indexed documents

---

## install

**requirements**

funes always needs [Ollama](https://ollama.com). [Rust](https://rustup.rs) is only required if you install via `cargo install`.

```bash
# pull the models funes needs
ollama pull nomic-embed-text
ollama pull llama3
```

Then install funes with whichever method fits your setup:

<details open>
<summary><b>Shell script (macOS / Linux)</b> — installs a prebuilt binary</summary>

```bash
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/bhavv04/funes/releases/latest/download/funes-memory-installer.sh | sh
```

</details>

<details>
<summary><b>PowerShell (Windows)</b> — installs a prebuilt binary</summary>

```powershell
powershell -ExecutionPolicy Bypass -c "irm https://github.com/bhavv04/funes/releases/latest/download/funes-memory-installer.ps1 | iex"
```

</details>

<details>
<summary><b>Homebrew (macOS / Linux)</b></summary>

```bash
brew install bhavv04/tap/funes-memory
```

</details>

<details>
<summary><b>Cargo</b> — builds from source, requires Rust</summary>

```bash
cargo install funes-memory
```

</details>

<details>
<summary><b>Manual download</b> — grab a prebuilt binary directly</summary>

| platform | file |
|---|---|
| macOS — Apple Silicon | [funes-memory-aarch64-apple-darwin.tar.xz](https://github.com/bhavv04/funes/releases/latest/download/funes-memory-aarch64-apple-darwin.tar.xz) |
| macOS — Intel | [funes-memory-x86_64-apple-darwin.tar.xz](https://github.com/bhavv04/funes/releases/latest/download/funes-memory-x86_64-apple-darwin.tar.xz) |
| Windows x64 (.msi) | [funes-memory-x86_64-pc-windows-msvc.msi](https://github.com/bhavv04/funes/releases/latest/download/funes-memory-x86_64-pc-windows-msvc.msi) |
| Windows x64 (.zip) | [funes-memory-x86_64-pc-windows-msvc.zip](https://github.com/bhavv04/funes/releases/latest/download/funes-memory-x86_64-pc-windows-msvc.zip) |
| Linux x64 | [funes-memory-x86_64-unknown-linux-gnu.tar.xz](https://github.com/bhavv04/funes/releases/latest/download/funes-memory-x86_64-unknown-linux-gnu.tar.xz) |
| Linux ARM64 | [funes-memory-aarch64-unknown-linux-gnu.tar.xz](https://github.com/bhavv04/funes/releases/latest/download/funes-memory-aarch64-unknown-linux-gnu.tar.xz) |

Checksums (`.sha256`) are published alongside each asset on the [releases page](https://github.com/bhavv04/funes/releases/latest).

> **note:** Windows may show an "unknown publisher" warning since the binary isn't code-signed yet. Choose "more info" → "run anyway", or verify the checksum first.

</details>

---

## quickstart

```bash
# index your projects and notes
funes add ~/projects
funes add ~/notes

# index your shell history
funes index-history

# search
funes query "that postgres deadlock fix"
funes query "the nginx config that fixed the 502s"

# get a plain English answer
funes query "how did I fix the redis timeout issue" --llm

# start the file watcher
funes watch ~/projects
funes start
```

---

## commands

| command | description |
|---|---|
| `funes start` | start the file watcher daemon |
| `funes stop` | stop the daemon |
| `funes status` | show indexed chunk count and watched dirs |
| `funes add <path>` | manually index a file or directory |
| `funes watch <path>` | add a directory to the watch list |
| `funes unwatch <path>` | remove a directory from the watch list |
| `funes query <question>` | semantic search over your index |
| `funes query <question> --llm` | synthesized plain English answer |
| `funes query <question> --json` | machine-readable JSON output |
| `funes index-history` | index shell history |
| `funes forget <pattern>` | exclude files matching a pattern |
| `funes reindex` | wipe and reindex everything |
| `funes clear` | wipe the index |
| `funes config` | show config file path |

---

## configuration

funes is configured via `~/.funes/config.toml`, created automatically on first run.

```toml
[core]
watch_dirs = ["~/projects", "~/notes"]
exclude = ["*.env", "*.secret", "node_modules", ".git", "target"]
auto_start = false

[embedder]
provider = "ollama"
model = "nomic-embed-text"
endpoint = "http://localhost:11434"

[llm]
provider = "ollama"
model = "llama3"
endpoint = "http://localhost:11434"

[store]
path = "~/.funes/db"
max_size_gb = 5
```

---

## how it works

```
files → chunker → embedder (nomic-embed-text) → SQLite → cosine similarity → results
```


funes monitors your configured directories using OS-level file system events. when a file changes it is chunked by content type, code by function blocks, markdown by headings, shell history one command per line, then embedded using `nomic-embed-text` running locally via Ollama. embeddings are stored as vectors in a local SQLite database. at query time your question is embedded and compared against every stored vector using cosine similarity.

full technical breakdown at [getfunes.vercel.app/docs/how-it-works](https://getfunes.vercel.app/docs/how-it-works).

---

## roadmap

- [x] CLI skeleton
- [x] Ollama embeddings
- [x] SQLite vector storage
- [x] file watcher
- [x] shell history indexing
- [x] semantic query with ranked results
- [x] LLM synthesis mode (`--llm`)
- [x] packaging — `cargo install funes-memory`
- [x] prebuilt binaries via `cargo-dist` (macOS, Windows, Linux)
- [x] Homebrew packaging
- [ ] true background daemon mode
- [ ] code signing for Windows binaries
- [ ] batch embedding for faster indexing
- [ ] plugin system for browser history, Notion, Obsidian

---

## contributing

contributions are welcome. see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

if you find a security issue please see [SECURITY.md](SECURITY.md) -> do not open a public issue.

---

## license

MIT -> see [LICENSE](LICENSE) for details.

---

*named after Ireneo Funes, the protagonist of Jorge Luis Borges' 1942 story [Funes the Memorious](https://en.wikipedia.org/wiki/Funes_the_Memorious), a man who forgets nothing.*