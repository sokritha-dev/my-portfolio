import Link from "next/link";

import { cn } from "@/lib/utils";

type SiteNavigationProps = {
  active: "about" | "notes";
};

const links = [
  { id: "about" as const, label: "About", href: "/" },
  { id: "notes" as const, label: "Notes", href: "/notes" },
];

export function SiteNavigation({ active }: SiteNavigationProps) {
  return (
    <aside>
      <nav className="flex gap-2 lg:hidden">
        {links.map((link) => {
          const isActive = link.id === active;

          return (
            <Link
              key={link.id}
              href={link.href}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "border-foreground/30 bg-foreground/5 text-foreground"
                  : "border-[hsl(var(--hairline))] text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label === "About" ? "About Me" : "Technical Notes"}
            </Link>
          );
        })}
      </nav>

      <div className="hidden lg:fixed lg:left-4 lg:top-1/2 lg:z-40 lg:flex lg:-translate-y-1/2 lg:flex-col lg:gap-3">
        {links.map((link) => {
          const isActive = link.id === active;

          return (
            <Link
              key={link.id}
              href={link.href}
              aria-label={
                link.label === "About" ? "About Me" : "Technical Notes"
              }
              className={cn(
                "flex h-36 w-14 items-center justify-center rounded-[1.5rem] border bg-card/90 px-2 py-4 transition-colors",
                isActive
                  ? "border-foreground/30 text-foreground"
                  : "border-[hsl(var(--hairline))] text-muted-foreground hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "text-xs font-semibold uppercase tracking-[0.28em]",
                  "rotate-180 [writing-mode:vertical-rl]"
                )}
              >
                {link.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
}
