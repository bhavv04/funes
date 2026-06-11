"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { FiGithub as Github } from "react-icons/fi";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

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

  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className=" font-bold text-lg tracking-tight">
          funes
        </span>

        <div className="flex items-center gap-4">
          <a
            href="#install"
            className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            install
          </a>
          <a
            href="#roadmap"
            className="text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            roadmap
          </a>
            <a
            href="https://github.com/bhavv04/funes"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <Github size={18} />
          </a>

          {mounted && (
            <button
                onClick={(e) => toggleTheme(e)}
                className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors"
                >
                <div
                    key={theme}
                    style={{ animation: "iconSpin 0.4s ease forwards" }}
                >
                    {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
                </div>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}