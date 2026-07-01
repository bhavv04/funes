"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { FiGithub as Github } from "react-icons/fi";
import TerminalDemo from "@/components/ui/terminal-demo";;
import { useTheme } from "next-themes";

const INSTALL_COMMAND = "cargo install funes";

export default function Hero() {
  const [copied, setCopied] = useState(false);

  // inside your Hero component, add:
    const { resolvedTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), [])

  const handleCopy = () => {
    navigator.clipboard.writeText(INSTALL_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="flex flex-col items-center justify-center px-6">
      <div className="w-full max-w-2xl mx-auto space-y-12">

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <img
                src={mounted && resolvedTheme === "dark" ? "/raven.png" : "/blackraven.png"}
                alt="funes"
                className="w-16 h-16 object-contain"
            />
            <h1 className=" text-5xl font-bold">
                funes
            </h1>
            </div>
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

      </div>
    </section>
  );
}