"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { NotePreview } from "@/lib/sanity/notes";
import { cn } from "@/lib/utils";

type NotesIndexProps = {
  notes: NotePreview[];
};

function collectTags(notes: NotePreview[]): string[] {
  const tags = new Set<string>();

  for (const note of notes) {
    for (const tag of note.tags ?? []) {
      const trimmed = tag.trim();
      if (trimmed) {
        tags.add(trimmed);
      }
    }
  }

  return Array.from(tags).sort((a, b) =>
    a.localeCompare(b, undefined, { sensitivity: "base" })
  );
}

export function NotesIndex({ notes }: NotesIndexProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const tags = useMemo(() => collectTags(notes), [notes]);

  const filteredNotes = useMemo(() => {
    if (!activeTag) {
      return notes;
    }

    return notes.filter((note) =>
      (note.tags ?? []).some(
        (tag) => tag.localeCompare(activeTag, undefined, { sensitivity: "base" }) === 0
      )
    );
  }, [activeTag, notes]);

  if (notes.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 sm:mt-16">
      {tags.length > 0 ? (
        <div className="border-t border-[hsl(var(--hairline))] pt-6">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[hsl(var(--label-gold))] sm:text-xs">
            Technology
          </p>
          <div
            className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2"
            role="list"
            aria-label="Technology tags"
          >
            <button
              type="button"
              role="listitem"
              onClick={() => setActiveTag(null)}
              className={cn(
                "text-sm transition-colors",
                activeTag === null
                  ? "text-foreground underline underline-offset-4 decoration-foreground/50"
                  : "text-muted-foreground hover:text-foreground"
              )}
              aria-pressed={activeTag === null}
            >
              All
            </button>
            {tags.map((tag) => {
              const isActive =
                activeTag !== null &&
                tag.localeCompare(activeTag, undefined, {
                  sensitivity: "base",
                }) === 0;

              return (
                <button
                  key={tag}
                  type="button"
                  role="listitem"
                  onClick={() => setActiveTag(isActive ? null : tag)}
                  className={cn(
                    "text-sm transition-colors",
                    isActive
                      ? "text-foreground underline underline-offset-4 decoration-foreground/50"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                  aria-pressed={isActive}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-2 border-t border-[hsl(var(--hairline))] pt-2">
        {filteredNotes.length === 0 ? (
          <p className="py-10 text-sm text-muted-foreground">
            No notes with the tag “{activeTag}”.
          </p>
        ) : (
          <ul>
            {filteredNotes.map((note) => (
              <li
                key={note.slug}
                className="border-b border-[hsl(var(--hairline))]"
              >
                <Link
                  href={`/notes/${note.slug}`}
                  className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-8"
                >
                  <span className="min-w-0">
                    {note.series?.title && note.series.part ? (
                      <span className="mb-1 block text-[10px] font-medium uppercase tracking-[0.12em] text-[hsl(var(--label-gold))]">
                        {note.series.title}
                        <span
                          className="mx-1.5 text-muted-foreground/50"
                          aria-hidden
                        >
                          ·
                        </span>
                        Part {note.series.part}
                      </span>
                    ) : null}
                    <span className="font-serif text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-foreground/75 sm:text-xl">
                      {note.title}
                    </span>
                    {note.tags.length > 0 ? (
                      <span className="mt-1.5 block text-xs text-muted-foreground">
                        {note.tags.join(" · ")}
                      </span>
                    ) : null}
                  </span>
                  <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                    {note.displayDate}
                    <span className="mx-2 text-[hsl(var(--hairline))]" aria-hidden>
                      ·
                    </span>
                    {note.readingTimeLabel.replace(" read", "")}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
