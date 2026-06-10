# Contributing to funes

First off, thank you for looking into contributing to **funes**.

The project is in its early stages, and community help is exactly what will help it mature from a cool concept into an indispensable tool.

We welcome everything from bug reports and documentation fixes to major features on the roadmap.

## Finding Something to Work On

Check the roadmap in the README or browse GitHub Issues.

* If you want to tackle an unassigned roadmap item (such as SQLite storage or the file watcher), please open an issue first to discuss the architecture before starting implementation.
* For bugs, look for issues labeled `bug`.
* For feature requests, look for issues labeled `enhancement`.

## Setting Up Your Development Environment

funes relies on local AI tooling, so you'll need:

### 1. Install Rust

Install Rust and Cargo using:

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

Or visit: https://rustup.rs

### 2. Install Ollama

Install Ollama and ensure the daemon is running.

Pull the required models:

```bash
ollama pull nomic-embed-text
ollama pull llama3
```

### 3. Clone and Build

```bash
git clone https://github.com/yourusername/funes.git
cd funes

cargo build
```

## Development Workflow

Create a feature branch:

```bash
git checkout -b feature/your-feature-name
```

Make your changes and test locally.

Before opening a pull request, run:

```bash
cargo fmt --check
cargo clippy
cargo test
```

## Pull Requests

When submitting a PR:

1. Keep changes focused and scoped.
2. Write clear commit messages.
3. Include tests when appropriate.
4. Update documentation if behavior changes.
5. Link any relevant issues.

## Code Guidelines

### Local First & Privacy

funes is fundamentally a local-first tool.

Features must not send user data to external APIs or cloud services. All indexing, storage, embeddings, and querying should remain on the user's machine.

### Error Handling

Use idiomatic Rust error handling.

Avoid:

```rust
unwrap()
panic!()
```

in production paths, especially daemon and indexing code.

### Performance

funes is intended to run quietly in the background.

Favor efficient algorithms and avoid unnecessary memory allocations or filesystem scans.

### Testing

Add tests whenever practical, especially for:

* Chunking logic
* File discovery
* Ignore pattern handling
* Database interactions
* Query ranking
* CLI behavior

## Architecture Principles

The long-term goals of the project are:

* Local-first
* Privacy-preserving
* Fast
* Cross-platform
* Minimal dependencies where possible
* Simple user experience

Every contribution should help move the project toward those goals.

## Questions or Ideas?

If you have an idea that doesn't fit an existing issue, feel free to open a discussion or create an issue labeled `enhancement`.

We'd love to hear your thoughts.
