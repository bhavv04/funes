import { FiGithub as Github } from "react-icons/fi";
import { FaBookOpen } from "react-icons/fa";
import { FaScaleBalanced } from "react-icons/fa6";
import { FaRust } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))]">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4">

        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">funes,</span>
          <span className="text-[hsl(var(--muted-foreground))] text-sm">
            your machine's memory, queryable.
          </span>
        </div>

        <div className="flex items-center gap-6 text-xs sm:text-sm text-[hsl(var(--muted-foreground))]">

          <a
            href="/docs"
            className="flex items-center gap-1.5 hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <FaBookOpen className="h-3.5 w-3.5" />
            docs
          </a>

          <a
            href="https://github.com/bhavv04/funes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            github
          </a>

          <a
            href="https://github.com/bhavv04/funes/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <FaScaleBalanced className="h-3.5 w-3.5" />
            mit license
          </a>

          <a
            href="https://crates.io/crates/funes-memory"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-[hsl(var(--foreground))] transition-colors"
          >
            <FaRust className="h-3.5 w-3.5" />
            crates.io
          </a>

        </div>

      </div>
    </footer>
  );
}