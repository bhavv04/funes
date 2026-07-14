import Button from "@/components/ui/Button";

const commands = [
  {
    cmd: "funes start",
    description: "Start the file watcher. Monitors all configured watch directories and automatically reindexes files as they change.",
    note: "runs in the foreground in v1.0. daemon mode coming in v1.1.",
  },
  {
    cmd: "funes stop",
    description: "Stop the running daemon.",
  },
  {
    cmd: "funes status",
    description: "Show the current state of funes — indexed chunk count, database location, and watched directories.",
  },
  {
    cmd: "funes add <path>",
    description: "Manually index a file or directory. Recursively indexes all supported file types.",
    example: "funes add ~/projects/myapp",
  },
  {
    cmd: "funes watch <path>",
    description: "Add a directory to the watch list. funes will monitor it for changes when the daemon is running.",
    example: "funes watch ~/notes",
  },
  {
    cmd: "funes unwatch <path>",
    description: "Remove a directory from the watch list.",
    example: "funes unwatch ~/notes",
  },
  {
    cmd: "funes query <question>",
    description: "Search your indexed memory with natural language. Returns the top 5 most semantically relevant results.",
    example: `funes query "that postgres deadlock fix"`,
  },
  {
    cmd: "funes query <question> --llm",
    description: "Same as query but pipes the top results into a local LLM via Ollama for a synthesized plain English answer.",
    example: `funes query "how did I fix the nginx 502s" --llm`,
  },
  {
    cmd: "funes query <question> --json",
    description: "Returns results as JSON. Useful for scripting and piping into other tools.",
    example: `funes query "postgres fix" --json | jq '.[0].content'`,
  },
  {
    cmd: "funes index-history",
    description: "Index your shell history. Supports bash, zsh, fish, and PowerShell history files.",
  },
  {
    cmd: "funes forget <pattern>",
    description: "Add an exclusion rule. Files matching the pattern will never be indexed.",
    example: `funes forget "*.env"`,
  },
  {
    cmd: "funes reindex",
    description: "Wipe the entire index and reindex everything from scratch.",
  },
  {
    cmd: "funes clear",
    description: "Wipe the entire index without reindexing.",
  },
  {
    cmd: "funes config",
    description: "Show the path to the config file.",
  },
];

export default function CommandsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">commands</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          full reference for all funes CLI commands.
        </p>
      </div>

      <div className="space-y-4">
        {commands.map((c) => (
          <div
            key={c.cmd}
            className="border border-[hsl(var(--border))] rounded-lg p-4 space-y-2"
          >
            <p className="font-mono font-bold text-sm">{c.cmd}</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {c.description}
            </p>
            {c.example && (
              <div className="bg-[hsl(var(--muted))]/30 rounded px-3 py-2 font-mono text-xs">
                <span className="text-green-500">$</span> {c.example}
              </div>
            )}
            {c.note && (
              <p className="text-xs text-yellow-500">
                ⚠ {c.note}
              </p>
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-4">
        <a href="/docs/configuration">
          <Button variant="default" size="default">
            configuration →
          </Button>
        </a>
      </div>
    </div>
  );
}