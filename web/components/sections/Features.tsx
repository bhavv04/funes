import { Search, Database, Terminal } from "lucide-react";

const STEPS = [
  {
    icon: Terminal,
    step: "01",
    title: "watch",
    description:
      "funes runs quietly in the background, monitoring your files, notes, and shell history for changes in real time.",
  },
  {
    icon: Database,
    step: "02",
    title: "index",
    description:
      "every file is chunked and converted into a vector embedding using a local AI model via Ollama. nothing leaves your machine.",
  },
  {
    icon: Search,
    step: "03",
    title: "query",
    description:
      "ask anything in plain English. funes finds the most semantically relevant results across everything you've ever worked on.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6">
      <div className="w-full max-w-3xl mx-auto space-y-12">

        <div className="space-y-2">
          <p className=" text-sm text-[hsl(var(--muted-foreground))]">
            how it works
          </p>
          <h2 className="text-2xl font-bold tracking-tight">
            three steps. no setup beyond install.
          </h2>
        </div>

        <div className="space-y-8">
          {STEPS.map(({ icon: Icon, step, title, description }) => (
            <div
              key={step}
              className="flex gap-6 items-start pb-8 border-b border-[hsl(var(--border))] last:border-0 last:pb-0"
            >
              <div className="shrink-0 w-10 h-10 rounded-lg border border-[hsl(var(--border))] flex items-center justify-center bg-[hsl(var(--muted))]/30">
                <Icon size={18} className="text-[hsl(var(--muted-foreground))]" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className=" text-xs text-[hsl(var(--muted-foreground))]">
                    {step}
                  </span>
                  <h3 className=" font-bold">{title}</h3>
                </div>
                <p className="text-[hsl(var(--muted-foreground))] leading-relaxed text-sm">
                  {description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}