"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { FiGithub as Github } from "react-icons/fi";
import TerminalDemo from "@/components/ui/terminal-demo";

const INSTALL_COMMAND = "cargo install funes";

export default function Hero() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 pt-14">
      <div className="w-full max-w-2xl mx-auto space-y-12">

        <div className="space-y-4">
          <h1 className="font-mono text-5xl font-bold tracking-tight">
            funes
          </h1>
          <p className="text-xl text-[hsl(var(--muted-foreground))] leading-relaxed">
            your machine's memory, queryable.
          </p>
          <p className="text-[hsl(var(--muted-foreground))] max-w-lg leading-relaxed">
            indexes your files, notes, and shell history locally.
            ask questions in plain English. no cloud, no accounts —
            your data never leaves your machine.
          </p>
        </div>

        <TerminalDemo />

        <div className="space-y-3">
          <p className="text-sm text-[hsl(var(--muted-foreground))] font-mono">
            — install
          </p>
          <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30">
            <span className="font-mono text-sm">
              <span className="text-green-500">$</span> {INSTALL_COMMAND}
            </span>
            <button
              onClick={handleCopy}
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors shrink-0"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </button>
          </div>
          <p className="text-xs text-[hsl(var(--muted-foreground))]">
            requires rust and ollama. see{" "}
            <a
              href="https://github.com/yourusername/funes"
              className="underline underline-offset-4 hover:text-[hsl(var(--foreground))] transition-colors"
            >
              github
            </a>{" "}
            for full setup instructions.
          </p>
        </div>

        <a
          href="https://github.com/yourusername/funes"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <Github size={15} />
          view source on github
        </a>

      </div>
    </section>
  );
}