import Button from "@/components/ui/Button";

const config = [
  {
    section: "[core]",
    fields: [
      {
        key: "watch_dirs",
        type: "array of strings",
        default: "[]",
        description: "directories funes watches for file changes when the daemon is running.",
        example: `watch_dirs = ["~/projects", "~/notes"]`,
      },
      {
        key: "exclude",
        type: "array of strings",
        default: `["*.env", "*.secret", "node_modules", ".git", "target"]`,
        description: "glob patterns for files and directories to never index. supports * wildcards.",
        example: `exclude = ["*.env", "*.secret", "node_modules", ".git"]`,
      },
      {
        key: "auto_start",
        type: "boolean",
        default: "false",
        description: "automatically start the watcher daemon on login. coming in v1.1.",
        example: `auto_start = false`,
      },
    ],
  },
  {
    section: "[embedder]",
    fields: [
      {
        key: "provider",
        type: "string",
        default: `"ollama"`,
        description: "the embedding provider to use. currently only ollama is supported.",
        example: `provider = "ollama"`,
      },
      {
        key: "model",
        type: "string",
        default: `"nomic-embed-text"`,
        description: "the embedding model to use. nomic-embed-text produces 768-dimensional vectors and is recommended.",
        example: `model = "nomic-embed-text"`,
      },
      {
        key: "endpoint",
        type: "string",
        default: `"http://localhost:11434"`,
        description: "the ollama API endpoint. change this if you run ollama on a different port.",
        example: `endpoint = "http://localhost:11434"`,
      },
    ],
  },
  {
    section: "[llm]",
    fields: [
      {
        key: "provider",
        type: "string",
        default: `"ollama"`,
        description: "the LLM provider for --llm synthesis mode.",
        example: `provider = "ollama"`,
      },
      {
        key: "model",
        type: "string",
        default: `"llama3"`,
        description: "the model used for synthesizing plain English answers in --llm mode.",
        example: `model = "llama3"`,
      },
      {
        key: "endpoint",
        type: "string",
        default: `"http://localhost:11434"`,
        description: "the ollama API endpoint for LLM calls.",
        example: `endpoint = "http://localhost:11434"`,
      },
    ],
  },
  {
    section: "[store]",
    fields: [
      {
        key: "path",
        type: "string",
        default: `"~/.funes/db"`,
        description: "path to the local SQLite vector database.",
        example: `path = "~/.funes/db"`,
      },
      {
        key: "max_size_gb",
        type: "integer",
        default: "5",
        description: "maximum size of the database in gigabytes.",
        example: `max_size_gb = 5`,
      },
    ],
  },
];

export default function ConfigurationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">configuration</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          funes is configured via a TOML file at{" "}
          <span className="font-mono text-sm">~/.funes/config.toml</span>.
          it is created automatically on first run with sensible defaults.
        </p>
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold">default config</h2>
        <div className="bg-[hsl(var(--muted))]/30 rounded-lg px-4 py-4 font-mono text-sm space-y-1">
          <div className="text-[hsl(var(--muted-foreground))]">[core]</div>
          <div>watch_dirs = []</div>
          <div>{`exclude = ["*.env", "*.secret", "node_modules", ".git", "target"]`}</div>
          <div>auto_start = false</div>
          <div className="mt-2 text-[hsl(var(--muted-foreground))]">[embedder]</div>
          <div>provider = "ollama"</div>
          <div>model = "nomic-embed-text"</div>
          <div>endpoint = "http://localhost:11434"</div>
          <div className="mt-2 text-[hsl(var(--muted-foreground))]">[llm]</div>
          <div>provider = "ollama"</div>
          <div>model = "llama3"</div>
          <div>endpoint = "http://localhost:11434"</div>
          <div className="mt-2 text-[hsl(var(--muted-foreground))]">[store]</div>
          <div>path = "~/.funes/db"</div>
          <div>max_size_gb = 5</div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-bold">reference</h2>
        {config.map((section) => (
          <div key={section.section} className="space-y-3">
            <p className="font-mono font-bold text-sm text-[hsl(var(--muted-foreground))]">
              {section.section}
            </p>
            {section.fields.map((field) => (
              <div
                key={field.key}
                className="border border-[hsl(var(--border))] rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <p className="font-mono font-bold text-sm">{field.key}</p>
                  <span className="text-xs text-[hsl(var(--muted-foreground))] font-mono">
                    {field.type}
                  </span>
                </div>
                <p className="text-sm text-[hsl(var(--muted-foreground))]">
                  {field.description}
                </p>
                <div className="bg-[hsl(var(--muted))]/30 rounded px-3 py-2 font-mono text-xs">
                  {field.example}
                </div>
                <p className="text-xs text-[hsl(var(--muted-foreground))]">
                  default: <span className="font-mono">{field.default}</span>
                </p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <a href="/docs/how-it-works">
          <Button variant="default" size="default">
            how it works →
          </Button>
        </a>
      </div>
    </div>
  );
}