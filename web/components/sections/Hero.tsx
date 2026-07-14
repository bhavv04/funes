"use client";

import { useEffect, useState } from "react";
import { FiGithub as Github } from "react-icons/fi";
import { FaRust as Rust } from "react-icons/fa";
import Demo from "@/components/sections/Demo";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/Button";
import { ArrowRightIcon } from "lucide-react";
import { Logo } from "@/components/ui/Logo";
import Image from "next/image";


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
    <section className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center pt-20 px-6">
    
    {/* background image */}
    <Image
        src="/bgfunes.png"
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-0 sm:opacity-70 pointer-events-none select-none"
        fill 
    />

    <div className="relative z-10 w-full max-w-3xl mx-auto space-y-12">
        
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Logo className="w-16 h-16" />
            <h1 className=" text-5xl font-bold">
                funes
            </h1>
            </div>
          <p className="text-xl text-[hsl(var(--muted-foreground))] leading-relaxed">
            your machine's memory, queryable.
          </p>
          <p className="text-[hsl(var(--muted-foreground))] max-w-lg leading-relaxed">
            indexes your files, notes, and shell history locally.
            ask questions in plain English. no cloud, no accounts -
            your data never leaves your machine.
          </p>

        <div className="pt-2 flex flex-col items-start sm:flex-row sm:items-center gap-2">
            {/* Top row on mobile */}
            <div className="flex items-center gap-2">
                <Button variant="default" size="default">
                <a
                    href="https://github.com/bhavv04/funes"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                >
                    <Github className="h-4 w-4" />
                    github
                </a>
                </Button>

                <Button variant="default" size="default">
                <a
                    href="https://crates.io/crates/funes-memory"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                >
                    <Rust className="h-4 w-4" />
                    crates.io
                </a>
                </Button>
            </div>

            {/* Second row on mobile */}
            <Button variant="default" size="default">
                <a href="/docs" className="flex items-center gap-2">
                read the docs
                <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
            </Button>
            </div>

        </div>

        <Demo />

      </div>
    </section>
  );
}