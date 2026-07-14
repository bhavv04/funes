"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { FiGithub as Github } from "react-icons/fi";
import { Logo } from "@/components/ui/Logo";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleTheme = (e: React.MouseEvent) => {
    const x = e.clientX;
    const y = e.clientY;

    document.documentElement.style.setProperty("--x", `${x}px`);
    document.documentElement.style.setProperty("--y", `${y}px`);

    if (!document.startViewTransition) {
      setTheme(theme === "dark" ? "light" : "dark");
      return;
    }

    document.startViewTransition(() => {
      const root = document.documentElement;
      if (root.classList.contains("dark")) {
        root.classList.remove("dark");
        setTheme("light");
      } else {
        root.classList.add("dark");
        setTheme("dark");
      }
    });
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-[hsl(var(--background))]/80 backdrop-blur-sm">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">

        <a href="/" className="flex items-center gap-2 font-bold text-xl">
          <Logo className="w-6 h-6" />
          funes
        </a>

        <div className="flex items-center gap-5">
          <a
            href="/docs"
            className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            docs
          </a>
          <a
            href="/#install"
            className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            install
          </a>
          <a
            href="https://github.com/bhavv04/funes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <Github size={17} />
          </a>

          {mounted && (
            <button
              onClick={toggleTheme}
              className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
            >
              <div
                key={theme}
                style={{ animation: "iconSpin 0.4s ease forwards" }}
              >
                {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
              </div>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}