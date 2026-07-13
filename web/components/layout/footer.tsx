import { FiGithub as Github } from "react-icons/fi";
import { Button } from "@/components/ui/Button";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
        <span className="text-sm text-muted-foreground">
          funes, your machine's memory, queryable
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            leftIcon={<Github />}
            className="text-muted-foreground"
          >
            <a
              href="https://github.com/bhavv04/funes"
              target="_blank"
              rel="noopener noreferrer"
            >
              github
            </a>
          </Button>

          <Button
            variant="ghost"
            className="text-muted-foreground"
          >
            <a
              href="https://github.com/bhavv04/funes/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
            >
              mit license
            </a>
          </Button>
        </div>
      </div>
    </footer>
  );
}