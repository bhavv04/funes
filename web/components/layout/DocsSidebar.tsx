"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Rocket, Package, Terminal, Settings, BookOpen, Menu, X } from "lucide-react";

const nav = [
  {
    label: "getting started",
    items: [
      { href: "/docs", label: "introduction", icon: Rocket },
      { href: "/docs/getting-started", label: "installation", icon: Package },
    ],
  },
  {
    label: "guides",
    items: [
      { href: "/docs/commands", label: "commands", icon: Terminal },
      { href: "/docs/configuration", label: "configuration", icon: Settings },
      { href: "/docs/how-it-works", label: "how it works", icon: BookOpen },
    ],
  },
];

function NavContent({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <div className="space-y-6">
      {nav.map((group) => (
        <div key={group.label}>
          <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 px-2">
            {group.label}
          </p>
          <div className="flex flex-col gap-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  className={`
                    flex items-center gap-2.5 px-2 py-1.5 rounded-md text-sm
                    border-l-2 transition-colors
                    ${
                      active
                        ? "border-l-transparent text-[hsl(var(--foreground))] bg-[hsl(var(--muted))]/50 font-medium"
                        : "border-l-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/30"
                    }
                  `}
                >
                  <Icon size={14} />
                  {item.label}
                </a>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DocsSidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // lock body scroll while the drawer is open.
  // NOTE: relies on `scrollbar-gutter: stable` being set on `html` in your
  // global stylesheet — that reserves the scrollbar's width permanently, so
  // toggling `overflow: hidden` here never changes the viewport width (which
  // would otherwise shift any `position: fixed; right: …` elements, like the
  // trigger button below).
  useEffect(() => {
    if (open) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [open]);

  // close on escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div className="self-start shrink-0">
      {/* desktop sidebar */}
      <aside className="hidden xl:flex flex-col w-56 shrink-0">
        <div className="sticky top-20">
          <NavContent pathname={pathname} />
        </div>
      </aside>

      {/* mobile trigger — fixed corner button, out of normal flow */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="open docs navigation"
        aria-expanded={open}
        className="xl:hidden fixed bottom-4 right-4 z-40 inline-flex items-center justify-center size-10 rounded-full text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] shadow-md hover:text-[hsl(var(--foreground))] transition-colors"
      >
        <Menu size={16} />
      </button>

      {/* mobile drawer */}
      {open && (
        <div className="xl:hidden fixed inset-0 z-50">
          {/* overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
            onClick={() => setOpen(false)}
          />

          {/* panel */}
          <div className="absolute left-0 top-0 h-full w-64 bg-[hsl(var(--background))] px-4 py-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs text-[hsl(var(--muted-foreground))]">
                docs
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="close docs navigation"
                className="p-1 rounded-md text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--muted))]/30 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
            <NavContent pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}