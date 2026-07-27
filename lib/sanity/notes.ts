import { format, parseISO } from "date-fns";

import { isSanityConfigured, sanityClient } from "@/lib/sanity/client";
import {
  noteBySlugQuery,
  noteSlugsQuery,
  notesListQuery,
} from "@/lib/sanity/queries";
import type { Note, NoteListItem } from "@/lib/sanity/types";

export type NotePreview = NoteListItem & {
  displayDate: string;
};

export type NoteDetail = Note & {
  displayDate: string;
};

function withDisplayDate<T extends { publishedAt: string }>(note: T) {
  return {
    ...note,
    displayDate: format(parseISO(note.publishedAt), "MMM d, yyyy"),
  };
}

export async function getAllNotes(): Promise<NotePreview[]> {
  if (!isSanityConfigured()) {
    return [];
  }

  try {
    const notes = await sanityClient.fetch<NoteListItem[]>(notesListQuery);
    return notes.map(withDisplayDate);
  } catch {
    return [];
  }
}

export async function getNoteBySlug(slug: string): Promise<NoteDetail | null> {
  if (!isSanityConfigured()) {
    return null;
  }

  const note = await sanityClient.fetch<Note | null>(noteBySlugQuery, { slug });

  if (!note) {
    return null;
  }

  return withDisplayDate(note);
}

export async function getNoteSlugs(): Promise<string[]> {
  if (!isSanityConfigured()) {
    return [];
  }

  try {
    const slugs = await sanityClient.fetch<Array<{ slug: string }>>(noteSlugsQuery);
    return slugs.map((entry) => entry.slug);
  } catch {
    return [];
  }
}
