import Button from "@/components/ui/Button";

const steps = [
  {
    number: "01",
    title: "watching",
    description:
      "funes monitors directories you configure using OS-level file system events — inotify on Linux, FSEvents on macOS, and ReadDirectoryChangesW on Windows. when a file changes, it's queued for reindexing automatically.",
    detail: "powered by the notify crate in Rust — cross-platform, zero polling, instant detection.",
  },
  {
    number: "02",
    title: "chunking",
    description:
      "files are split into meaningful chunks rather than fixed token windows. code files are split by function blocks, markdown by headings and paragraphs, config files are treated as a single chunk, and shell history is split one command per chunk.",
    detail: "smart chunking means search results are precise — you get the relevant function, not an arbitrary 500-token window.",
  },
  {
    number: "03",
    title: "embedding",
    description:
      "each chunk is sent to nomic-embed-text running locally via Ollama. the model returns a 768-dimensional vector — a list of 768 numbers that represents the semantic meaning of the chunk. similar chunks produce similar vectors.",
    detail: "nomic-embed-text was chosen for its quality, speed, and small size. it runs entirely on your machine.",
  },
  {
    number: "04",
    title: "storing",
    description:
      "vectors and their metadata — file path, content, timestamp, chunk type — are stored in a local SQLite database at ~/.funes/funes.db. embeddings are serialized as JSON blobs. no external database, no server.",
    detail: "SQLite was chosen over dedicated vector databases for simplicity and zero-dependency installation.",
  },
  {
    number: "05",
    title: "querying",
    description:
      "when you run funes query, your question is embedded using the same model. funes then computes cosine similarity between your query vector and every stored vector, ranks them, and returns the top 5 most semantically relevant results.",
    detail: "cosine similarity measures the angle between two vectors — the closer to 1.0, the more semantically similar.",
  },
  {
    number: "06",
    title: "synthesis (--llm mode)",
    description:
      "with --llm, the top 5 results are passed as context to llama3 running locally via Ollama. the model synthesizes a plain English answer based only on your own content. no data leaves your machine at any point.",
    detail: "the prompt instructs the model to answer only from the provided context and admit when it doesn't know.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">how it works</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          a technical overview of what funes does under the hood.
        </p>
      </div>

      <div className="border border-[hsl(var(--border))] rounded-lg p-4 bg-[hsl(var(--muted))]/30 font-mono text-sm space-y-1">
        <div className="text-[hsl(var(--muted-foreground))]">pipeline</div>
        <div>files → chunker → embedder → SQLite → query engine → results</div>
      </div>

      <div className="space-y-4">
        {steps.map((step) => (
          <div
            key={step.number}
            className="border border-[hsl(var(--border))] rounded-lg p-5 space-y-2"
          >
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">
                {step.number}
              </span>
              <h3 className="font-mono font-bold">{step.title}</h3>
            </div>
            <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
              {step.description}
            </p>
            <p className="text-xs text-[hsl(var(--muted-foreground))] border-l-2 border-[hsl(var(--border))] pl-3 italic">
              {step.detail}
            </p>
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-bold">tech stack</h2>
        <div className="border border-[hsl(var(--border))] rounded-lg overflow-hidden">
          {[
            { layer: "language", choice: "Rust", reason: "performance, single binary, memory safety" },
            { layer: "embeddings", choice: "nomic-embed-text via Ollama", reason: "local, fast, 768-dim vectors" },
            { layer: "LLM", choice: "llama3 via Ollama", reason: "local, no API key, good quality" },
            { layer: "vector store", choice: "SQLite + cosine similarity", reason: "zero dependencies, embedded" },
            { layer: "file watching", choice: "notify crate", reason: "cross-platform OS-level events" },
            { layer: "CLI", choice: "clap", reason: "rust standard for CLI arg parsing" },
          ].map((row, i) => (
            <div
              key={row.layer}
              className={`flex gap-4 px-4 py-3 text-sm font-mono ${
                i % 2 === 0 ? "bg-[hsl(var(--muted))]/20" : ""
              }`}
            >
              <span className="text-[hsl(var(--muted-foreground))] w-28 shrink-0">
                {row.layer}
              </span>
              <span className="w-48 shrink-0">{row.choice}</span>
              <span className="text-[hsl(var(--muted-foreground))]">{row.reason}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <a href="https://github.com/bhavv04/funes" target="_blank" rel="noopener noreferrer">
          <Button variant="default" size="default">
            view source on github →
          </Button>
        </a>
      </div>
    </div>
  );
}