import { format, parseISO } from "date-fns";

import { isSanityConfigured, sanityClient } from "@/lib/sanity/client";
import {
  noteBySlugQuery,
  noteSlugsQuery,
  notesBySeriesSlugQuery,
  notesListQuery,
} from "@/lib/sanity/queries";
import type {
  Note,
  NoteBodyBlock,
  NoteListItem,
  NoteRelated,
  NoteRelatedLink,
  NoteSeriesNav,
  NoteSeriesPart,
  NoteTocHeading,
} from "@/lib/sanity/types";

export type NotePreview = NoteListItem & {
  displayDate: string;
  readingTimeLabel: string;
  takeaways?: string[];
  body?: NoteBodyBlock[];
};

export type NoteDetail = Note & {
  displayDate: string;
  readingTimeLabel: string;
  toc: NoteTocHeading[];
  seriesNav: NoteSeriesNav | null;
  related: NoteRelatedLink[];
};

/** Technical notes are short and denser than prose; use a slower pace so min-read scales. */
const WORDS_PER_MINUTE = 100;

function withDisplayDate<T extends { publishedAt: string }>(note: T) {
  return {
    ...note,
    displayDate: format(parseISO(note.publishedAt), "MMM d, yyyy"),
  };
}

/** Hide notes scheduled for the future (still visible in local `next dev`). */
export function isNoteLive(publishedAt: string, now = new Date()): boolean {
  if (process.env.NODE_ENV === "development") {
    return true;
  }

  const published = parseISO(publishedAt);
  if (Number.isNaN(published.getTime())) {
    return false;
  }
  return published.getTime() <= now.getTime();
}

function slugifyHeading(heading: string): string {
  return heading
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function bodyToPlainText(body: NoteBodyBlock[] | undefined): string {
  if (!body?.length) {
    return "";
  }

  return body
    .map((block) => {
      switch (block._type) {
        case "noteHeading":
          return block.heading;
        case "noteParagraph":
          return block.text;
        case "noteBullets":
          return (block.items ?? []).join(" ");
        case "noteImage":
          return [block.alt, block.caption].filter(Boolean).join(" ");
        case "noteCode":
          return block.code;
        case "noteTable":
          return [
            block.caption,
            ...(block.headers ?? []),
            ...(block.rows ?? []).flatMap((row) => row.cells ?? []),
          ]
            .filter(Boolean)
            .join(" ");
        default: {
          const _exhaustive: never = block;
          return _exhaustive;
        }
      }
    })
    .join(" ");
}

export function estimateReadingTimeMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function formatReadingTimeLabel(minutes: number): string {
  return `${minutes} min read`;
}

export function readingTimeForNote(note: {
  takeaways?: string[];
  body?: NoteBodyBlock[];
}): string {
  const text = [...(note.takeaways ?? []), bodyToPlainText(note.body)].join(
    " "
  );

  return formatReadingTimeLabel(estimateReadingTimeMinutes(text));
}

export function noteSeoDescription(note: {
  title: string;
  takeaways?: string[];
}): string {
  const takeaways = (note.takeaways ?? []).filter(Boolean);
  if (takeaways.length > 0) {
    return takeaways.join(" ");
  }
  return note.title;
}

export function extractTocHeadings(
  body: NoteBodyBlock[] | undefined
): NoteTocHeading[] {
  if (!body?.length) {
    return [];
  }

  const seen = new Map<string, number>();

  return body
    .filter(
      (block): block is Extract<NoteBodyBlock, { _type: "noteHeading" }> =>
        block._type === "noteHeading" && Boolean(block.heading)
    )
    .map((block) => {
      const base = slugifyHeading(block.heading) || "section";
      const count = seen.get(base) ?? 0;
      seen.set(base, count + 1);
      const id = count === 0 ? base : `${base}-${count + 1}`;
      return { id, label: block.heading };
    });
}

export function buildSeriesNav(
  series: { title: string; slug: string; part: number } | null | undefined,
  parts: NoteSeriesPart[]
): NoteSeriesNav | null {
  if (!series?.slug || !series.title || !series.part || parts.length === 0) {
    return null;
  }

  const ordered = [...parts].sort((a, b) => a.part - b.part);
  const index = ordered.findIndex((part) => part.part === series.part);

  if (index < 0) {
    return null;
  }

  return {
    title: series.title,
    part: series.part,
    totalParts: ordered.length,
    previous: index > 0 ? ordered[index - 1] : null,
    next: index < ordered.length - 1 ? ordered[index + 1] : null,
  };
}

function withReadingMeta<
  T extends {
    publishedAt: string;
    takeaways?: string[];
    body?: NoteBodyBlock[];
  },
>(note: T) {
  return {
    ...withDisplayDate(note),
    readingTimeLabel: readingTimeForNote(note),
  };
}

async function fetchSeriesParts(
  seriesSlug: string
): Promise<NoteSeriesPart[]> {
  try {
    const parts = await sanityClient.fetch<
      Array<NoteSeriesPart & { publishedAt?: string }>
    >(notesBySeriesSlugQuery, {
      seriesSlug,
    });
    return parts.filter(
      (part) => !part.publishedAt || isNoteLive(part.publishedAt)
    );
  } catch {
    return [];
  }
}

function buildRelatedLinks(
  relatedNotes: NoteRelated[] | null | undefined
): NoteRelatedLink[] {
  if (!relatedNotes?.length) {
    return [];
  }

  return relatedNotes
    .filter(
      (related): related is NoteRelated =>
        Boolean(related?.slug && related?.title && related?.publishedAt) &&
        isNoteLive(related.publishedAt)
    )
    .map((related) => ({
      slug: related.slug,
      title: related.title,
      displayDate: format(parseISO(related.publishedAt), "MMM d, yyyy"),
    }));
}

export async function getAllNotes(): Promise<NotePreview[]> {
  if (!isSanityConfigured()) {
    return [];
  }

  try {
    const notes = await sanityClient.fetch<
      Array<NoteListItem & { body?: NoteBodyBlock[] }>
    >(notesListQuery);
    return notes.filter((note) => isNoteLive(note.publishedAt)).map(withReadingMeta);
  } catch {
    return [];
  }
}

export async function getNoteBySlug(slug: string): Promise<NoteDetail | null> {
  if (!isSanityConfigured()) {
    return null;
  }

  const note = await sanityClient.fetch<Note | null>(noteBySlugQuery, { slug });

  if (!note || !isNoteLive(note.publishedAt)) {
    return null;
  }

  const withMeta = withReadingMeta({
    ...note,
    body: note.body ?? [],
  });

  const seriesParts = note.series?.slug
    ? await fetchSeriesParts(note.series.slug)
    : [];

  return {
    ...withMeta,
    body: note.body ?? [],
    takeaways: note.takeaways ?? [],
    toc: extractTocHeadings(note.body),
    seriesNav: buildSeriesNav(note.series, seriesParts),
    related: buildRelatedLinks(note.relatedNotes),
  };
}

export async function getNoteSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) {
    return [];
  }

  try {
    const notes = await sanityClient.fetch<
      Array<{ slug: string; publishedAt: string }>
    >(noteSlugsQuery);
    return notes
      .filter((entry) => isNoteLive(entry.publishedAt))
      .map((entry) => entry.slug);
  } catch {
    return [];
  }
}
