const DEMO_LINES = [
  { cmd: "funes start", output: "daemon started - watching ~/projects, ~/notes" },
  { cmd: 'funes query "that postgres deadlock fix"', output: "→ src/db/pool.rs [score: 0.94] - set idle_in_transaction_session_timeout = '5s'" },
  { cmd: 'funes query "nginx config for 502s"', output: "→ infra/nginx.conf [score: 0.91] - proxy_read_timeout 300s fixed it" },
  { cmd: "funes status", output: "indexed: 3,847 chunks · db: 12mb · uptime: 2d 4h" },
];

export default function Demo() {
  return (
    <div className="rounded-xl overflow-hidden border border-[hsl(var(--border))] shadow-2xl shadow-black  ring-1 ring-black/5">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted))]">
        <div className="w-3 h-3 rounded-full bg-red-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_1px_1px_rgba(0,0,0,0.15)]" />
        <div className="w-3 h-3 rounded-full bg-yellow-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_1px_1px_rgba(0,0,0,0.15)]" />
        <div className="w-3 h-3 rounded-full bg-green-500 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),0_1px_1px_rgba(0,0,0,0.15)]" />
        <span className="ml-2 text-xs text-[hsl(var(--muted-foreground))]">
          terminal
        </span>
      </div>
      <div className="p-5 space-y-4 text-sm bg-[hsl(var(--muted))]">
        {DEMO_LINES.map((line, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-green-500">$</span>
              <span>{line.cmd}</span>
            </div>
            <div className="text-[hsl(var(--muted-foreground))] pl-4">
              {line.output}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}