import Link from "next/link";

import { cn } from "@/lib/utils";

type NotesHeaderProps = {
  active: "about" | "notes";
};

const links = [
  { id: "about" as const, label: "About", href: "/" },
  { id: "notes" as const, label: "Notes", href: "/notes" },
];

export function NotesHeader({ active }: NotesHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-[hsl(var(--hairline))] bg-[hsl(var(--background)/0.92)] backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3.5 sm:gap-6 sm:px-8 sm:py-4 lg:px-10">
        <Link
          href="/"
          className="min-w-0 shrink font-serif text-base font-semibold tracking-tight text-foreground sm:text-xl"
        >
          Yen Sokritha
        </Link>
        <nav className="flex flex-wrap items-center justify-end gap-x-3 gap-y-1 sm:gap-x-6 md:gap-x-7">
          {links.map((link) => {
            const isActive = link.id === active;

            return (
              <Link
                key={link.id}
                href={link.href}
                className={cn(
                  "text-[10px] font-medium uppercase tracking-[0.12em] transition-colors sm:text-xs sm:tracking-[0.14em]",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
