import { FiGithub as Github } from "react-icons/fi";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[hsl(var(--border))]">
      <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center gap-2">
          <span className="font-bold text-sm">funes,</span>
          <span className="text-[hsl(var(--muted-foreground))] text-sm">
            your machine's memory, queryable.
          </span>
        </div>

        <div className="flex items-center gap-6 text-sm text-[hsl(var(--muted-foreground))]">
          <a
            href="/docs"
            className="hover:text-[hsl(var(--foreground))] transition-colors"
          >
            docs
          </a>
          <a
            href="https://github.com/bhavv04/funes"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[hsl(var(--foreground))] transition-colors"
          >
            github
          </a>
          <a
            href="https://github.com/bhavv04/funes/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[hsl(var(--foreground))] transition-colors"
          >
            mit license
          </a>
          <a
            href="https://crates.io/crates/funes-memory"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[hsl(var(--foreground))] transition-colors"
          >
            crates.io
          </a>
        </div>

      </div>
    </footer>
  );
}