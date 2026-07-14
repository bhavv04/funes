"use client";

import { usePathname } from "next/navigation";
import { Rocket, Package, Terminal, Settings, BookOpen } from "lucide-react";

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

export default function DocsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden xl:flex flex-col w-56 shrink-0">
      <div className="sticky top-20 space-y-6">
        {nav.map((group) => (
          <div key={group.label}>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mb-2 px-2 uppercase tracking-wider">
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
    </aside>
  );
}