import Link from "next/link";

import type { NoteSeriesNav } from "@/lib/sanity/types";

type NoteSeriesNavProps = {
  seriesNav: NoteSeriesNav;
};

export function NoteSeriesLabel({ seriesNav }: NoteSeriesNavProps) {
  const partLabel =
    seriesNav.totalParts > 1
      ? `Part ${seriesNav.part} of ${seriesNav.totalParts}`
      : `Part ${seriesNav.part}`;

  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[hsl(var(--label-gold))] sm:text-xs">
      {seriesNav.title}
      <span className="mx-2 text-muted-foreground/50" aria-hidden>
        ·
      </span>
      {partLabel}
    </p>
  );
}

export function NoteSeriesPager({ seriesNav }: NoteSeriesNavProps) {
  if (seriesNav.totalParts < 2) {
    return null;
  }

  return (
    <nav
      aria-label={`${seriesNav.title} parts`}
      className="mt-10 border-t border-[hsl(var(--hairline))] pt-8"
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[hsl(var(--label-gold))] sm:text-xs">
        {seriesNav.title}
      </p>
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:gap-8">
        {seriesNav.previous ? (
          <Link
            href={`/notes/${seriesNav.previous.slug}`}
            className="group max-w-xs text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="block text-[10px] uppercase tracking-[0.12em]">
              Previous
            </span>
            <span className="mt-1 block text-foreground underline underline-offset-4 decoration-foreground/30 group-hover:decoration-foreground">
              Part {seriesNav.previous.part}: {seriesNav.previous.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {seriesNav.next ? (
          <Link
            href={`/notes/${seriesNav.next.slug}`}
            className="group max-w-xs text-sm text-muted-foreground transition-colors hover:text-foreground sm:text-right"
          >
            <span className="block text-[10px] uppercase tracking-[0.12em]">
              Next
            </span>
            <span className="mt-1 block text-foreground underline underline-offset-4 decoration-foreground/30 group-hover:decoration-foreground">
              Part {seriesNav.next.part}: {seriesNav.next.title}
            </span>
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
