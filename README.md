# funes

Your machine's memory, queryable.

---

You fixed a weird Postgres bug 3 months ago. You remember it was something with deadlocks. You have no idea which file, which project, or what the fix was.

**funes remembers.**

It runs quietly in the background, indexes your files, notes, and terminal history, and lets you ask questions in plain English to find anything you've ever worked on.

```bash
funes query "that postgres deadlock fix"
funes query "what was I working on last Tuesday"
funes query "the nginx config that fixed the 502s"
```

No cloud. No account. No subscription. Everything stays on your machine.

## How It Works

funes watches your files and shell history, breaks them into chunks, and turns each chunk into a vector embedding using a local AI model. When you search, it finds the chunks that are closest in meaning to your question - not just keyword matches, but actual semantic understanding.

```text
your files -> chunker -> embedder -> local database -> query -> answer
```

All of this runs locally using Ollama. Your data never leaves your machine.

## install

Requirements: Rust and Ollama

### Requirements

* Rust
* Ollama

```bash
# Pull the models funes needs
ollama pull nomic-embed-text
ollama pull llama3

# Install funes
cargo install funes
```

## Usage

```bash
funes start                    # Start the background daemon
funes add ~/notes              # Manually index a folder
funes watch ~/projects         # Watch a folder for changes
funes query "something you remember vaguely"
funes query "..." --llm        # Get a plain English answer instead of raw results
funes status                   # See what's indexed
funes forget "*.env"           # Exclude sensitive files
```

## Why Funes?

Jorge Luis Borges wrote a short story in 1942 called *Funes the Memorious* - about a man who forgets nothing. Every detail of his life, perfectly preserved and instantly recallable.

That's the goal here. Not quite perfect memory, but close enough to be useful.

## Roadmap & Status

funes is early and under active development. contributions are very welcome.

- [x] CLI skeleton
- [x] Ollama embeddings working
- [x] SQLite / vector storage
- [x] File watcher
- [x] Shell history indexing
- [x] Query with results
- [x] LLM synthesis mode
- [x] Packaging (cargo install funes-memory)
- [ ] Packaging (Homebrew)
- [ ] Daemon (true background process)
- [ ] Docs

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## Contributing

We welcome contributions to help build out the roadmap. See `CONTRIBUTING.md` for details.