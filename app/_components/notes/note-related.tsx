import Link from "next/link";

import type { NoteRelatedLink } from "@/lib/sanity/types";

type NoteRelatedProps = {
  related: NoteRelatedLink[];
};

export function NoteRelated({ related }: NoteRelatedProps) {
  if (related.length === 0) {
    return null;
  }

  return (
    <nav
      aria-label="Related notes"
      className="mt-10 border-t border-[hsl(var(--hairline))] pt-8"
    >
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[hsl(var(--label-gold))] sm:text-xs">
        Related
      </p>
      <ul className="mt-4 space-y-3">
        {related.map((note) => (
          <li key={note.slug}>
            <Link
              href={`/notes/${note.slug}`}
              className="group block text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="text-foreground underline underline-offset-4 decoration-foreground/30 group-hover:decoration-foreground">
                {note.title}
              </span>
              <span className="mt-0.5 block text-[11px] tracking-wide text-muted-foreground/80">
                {note.displayDate}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
