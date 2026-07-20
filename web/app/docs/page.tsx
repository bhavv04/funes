import Button from "@/components/ui/Button";

export default function DocsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">funes</h1>
        <p className="text-[hsl(var(--muted-foreground))] text-lg">
          your machine's memory, queryable.
        </p>
      </div>

      <p>
        funes is a local AI memory daemon for the terminal. it indexes your
        files, notes, and shell history into a local vector database and lets
        you search everything with natural language — no cloud, no accounts,
        your data never leaves your machine.
      </p>

      <div className="border border-[hsl(var(--border))] rounded-lg p-4 bg-[hsl(var(--muted))]/30 font-mono text-sm space-y-2">
        <div><span className="text-green-500">$</span> funes query "that postgres deadlock fix"</div>
        <div className="text-[hsl(var(--muted-foreground))] pl-4">→ src/db/pool.rs [score: 0.94]</div>
        <div><span className="text-green-500">$</span> funes query "nginx config for 502s" --llm</div>
        <div className="text-[hsl(var(--muted-foreground))] pl-4">→ you fixed this by setting proxy_read_timeout 300s in infra/nginx.conf</div>
      </div>

      <h2 className="text-xl font-bold mt-8">why funes</h2>
      <p>
        every developer has had this moment — you fixed something tricky three
        months ago and now you need that fix again. you remember it vaguely but
        have no idea which file, which project, or what the solution was.
      </p>
      <p>
        cloud tools like Rewind and Mem.ai solve this but at the cost of privacy
        and a monthly subscription. funes is fully local, fully open source, and
        completely free.
      </p>

      <h2 className="text-xl font-bold mt-8">the name</h2>
      <p>
        Jorge Luis Borges wrote a short story in 1942 called{" "}
        <em>Funes the Memorious</em> — about a man who forgets nothing, remembers
        every detail of his life perfectly. that's the goal here. not quite
        perfect memory, but close enough to be useful.
      </p>

      <div className="flex gap-3 mt-8">
        <a href="/docs/getting-started">
          <Button variant="default" size="default">
            get started →
          </Button>
        </a>
        <a href="https://github.com/bhavv04/funes" target="_blank" rel="noopener noreferrer">
          <Button variant="secondary" size="default">
            github →
          </Button>
        </a>
      </div>
    </div>
  );
}