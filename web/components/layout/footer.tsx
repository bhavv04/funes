export default function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border))] py-8 mt-24">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className=" text-sm text-[hsl(var(--muted-foreground))]">
          funes — your machine's memory, queryable
        </span>
        <div className="flex items-center gap-6 text-sm text-[hsl(var(--muted-foreground))]">
          <a
            href="https://github.com/yourusername/funes"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[hsl(var(--foreground))] transition-colors"
          >
            github
          </a>
          <a
            href="https://github.com/yourusername/funes/blob/main/LICENSE"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[hsl(var(--foreground))] transition-colors"
          >
            mit license
          </a>
          <span>built in rust</span>
        </div>
      </div>
    </footer>
  );
}