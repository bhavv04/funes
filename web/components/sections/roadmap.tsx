"use client";

import { Check } from "lucide-react";

type RoadmapItem = {
  label: string;
  done: boolean;
  detail?: string;
};

const ROADMAP: RoadmapItem[] = [
  { label: "CLI skeleton", done: true, detail: "basic command structure" },
  { label: "Ollama embeddings working", done: true, detail: "local model integration" },
  { label: "SQLite / vector storage", done: true, detail: "persistent local index" },
  { label: "File watcher", done: false, detail: "live indexing on change" },
  { label: "Shell history indexing", done: false, detail: "bash / zsh / fish support" },
  { label: "Query with results", done: false, detail: "semantic search over index" },
  { label: "LLM synthesis mode", done: false, detail: "plain English answers" },
  { label: "Packaging (Homebrew, Cargo)", done: false, detail: "one-line install" },
];

export default function Roadmap() {
  const completedCount = ROADMAP.filter((item) => item.done).length;
  const progress = (completedCount / ROADMAP.length) * 100;

  return (
    <section id="roadmap" className="px-6 pt-18">
      <div className="w-full max-w-2xl mx-auto space-y-10">

        {/* Header */}
        <div className="space-y-2">
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            — roadmap
          </p>
          <div className="flex items-baseline justify-between">
            <h2 className="text-3xl font-bold tracking-tight">status</h2>
            <span className="text-sm text-[hsl(var(--muted-foreground))]">
              {completedCount}/{ROADMAP.length} done
            </span>
          </div>
        </div>

        <p className="text-[hsl(var(--muted-foreground))] leading-relaxed">
          funes is early and under active development. things will break.
          contributions are very welcome.
        </p>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 w-full rounded-full bg-[hsl(var(--muted))] overflow-hidden">
            <div
              className="h-full rounded-full bg-[hsl(var(--foreground))] transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            {Math.round(progress)}% complete
          </p>
        </div>

        {/* Timeline */}
        <div className="relative pl-1">
          {/* connecting line */}
          <div className="absolute left-3 top-2 bottom-0 w-px bg-[hsl(var(--border))]" />
          {/* filled portion of the line, up to last completed item */}
          <div
            className="absolute left-3 top-4 w-px bg-[hsl(var(--foreground))] transition-all duration-700 ease-out"
            style={{
              height:
                completedCount === 0
                  ? "0%"
                  : `calc(${((completedCount - 1) / (ROADMAP.length - 1)) * 100}% + 2px)`,
            }}
          />

          <div className="space-y-6">
            {ROADMAP.map((item) => (
              <div key={item.label} className="relative flex gap-4 pl-0">
                <span
                  className={`relative z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    item.done
                      ? "bg-[hsl(var(--foreground))] border-[hsl(var(--foreground))]"
                      : "bg-[hsl(var(--background))] border-[hsl(var(--border))]"
                  }`}
                >
                  {item.done && (
                    <Check
                      size={10}
                      strokeWidth={3}
                      className="text-[hsl(var(--background))]"
                    />
                  )}
                </span>

                <div className="flex-1 -translate-y-0.5">
                  <p
                    className={`text-sm ${
                      item.done
                        ? "text-[hsl(var(--muted-foreground))] line-through decoration-[hsl(var(--muted-foreground))]"
                        : "text-[hsl(var(--foreground))]"
                    }`}
                  >
                    {item.label}
                  </p>
                  {item.detail && (
                    <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
                      {item.detail}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          want to help build one of these? see{" "}
          <a
            href="https://github.com/bhavv04/funes/blob/main/CONTRIBUTING.md"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:text-[hsl(var(--foreground))] transition-colors"
          >
            CONTRIBUTING.md
          </a>
          .
        </p>
      </div>
    </section>
  );
}