import Button from "@/components/ui/Button";

export default function GettingStartedPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-3">getting started</h1>
        <p className="text-[hsl(var(--muted-foreground))]">
          get funes running on your machine in under 5 minutes.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">prerequisites</h2>
        <p>funes requires two things before installing:</p>

        <div className="space-y-3">
          <div className="border border-[hsl(var(--border))] rounded-lg p-4 space-y-2">
            <p className="font-mono font-bold text-sm">1. rust</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              funes is installed via cargo, the rust package manager.
            </p>
            <div className="bg-[hsl(var(--muted))]/30 rounded px-3 py-2 font-mono text-sm">
              <span className="text-green-500">$</span> curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
            </div>
            <p className="text-xs text-[hsl(var(--muted-foreground))]">
              on Windows, download from{" "}
              <a href="https://rustup.rs" className="underline underline-offset-4">rustup.rs</a>
            </p>
          </div>

          <div className="border border-[hsl(var(--border))] rounded-lg p-4 space-y-2">
            <p className="font-mono font-bold text-sm">2. ollama</p>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              funes uses ollama to run AI models locally. download from{" "}
              <a href="https://ollama.com" className="underline underline-offset-4">ollama.com</a>
              {" "}then pull the required models:
            </p>
            <div className="bg-[hsl(var(--muted))]/30 rounded px-3 py-2 font-mono text-sm space-y-1">
              <div><span className="text-green-500">$</span> ollama pull nomic-embed-text</div>
              <div><span className="text-green-500">$</span> ollama pull llama3</div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">install funes</h2>
        <div className="bg-[hsl(var(--muted))]/30 rounded-lg px-4 py-3 font-mono text-sm">
          <span className="text-green-500">$</span> cargo install funes-memory
        </div>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          this installs the <span className="font-mono">funes</span> command globally on your machine.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">first steps</h2>
        <p>once installed, index something and run your first query:</p>
        <div className="bg-[hsl(var(--muted))]/30 rounded-lg px-4 py-3 font-mono text-sm space-y-2">
          <div><span className="text-green-500"># index your notes or projects</span></div>
          <div><span className="text-green-500">$</span> funes add ~/notes</div>
          <div className="mt-2"><span className="text-green-500"># index your shell history</span></div>
          <div><span className="text-green-500">$</span> funes index-history</div>
          <div className="mt-2"><span className="text-green-500"># query everything</span></div>
          <div><span className="text-green-500">$</span> funes query "that postgres fix from last month"</div>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">start the watcher</h2>
        <p>
          to have funes automatically index files as you work, add a directory
          to the watch list and start the daemon:
        </p>
        <div className="bg-[hsl(var(--muted))]/30 rounded-lg px-4 py-3 font-mono text-sm space-y-1">
          <div><span className="text-green-500">$</span> funes watch ~/projects</div>
          <div><span className="text-green-500">$</span> funes start</div>
        </div>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          note: <span className="font-mono">funes start</span> runs in the foreground in v1.0.
          true background daemon mode is coming in v1.1.
        </p>
      </div>

      <div className="flex gap-3 pt-4">
        <a href="/docs/commands">
          <Button variant="default" size="default">
            commands reference →
          </Button>
        </a>
      </div>
    </div>
  );
}