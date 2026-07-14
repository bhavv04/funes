"use client";

import { FiGithub as Github } from "react-icons/fi";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";

export default function Install() {
  const INSTALL_COMMAND = "cargo install funes";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="install" className="flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-3xl mx-auto space-y-6">
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          install
        </p>

        <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--muted))]/30">
          <span className="text-sm">
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
            href="https://github.com/bhavv04/funes"
            className="underline underline-offset-4 hover:text-[hsl(var(--foreground))] transition-colors"
          >
            github
          </a>{" "}
          for full setup instructions.
        </p>

        <a
          href="https://github.com/bhavv04/funes"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
        >
          <Github size={16} />
          view source on github
        </a>
      </div>
    </section>
  );
}