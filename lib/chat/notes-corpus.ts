import { buildAboutChunks } from "@/lib/chat/about-corpus";
import { chunksFromDocument, type PortfolioChunk } from "@/lib/chat/chunk";
import { isNoteLive, bodyToPlainText } from "@/lib/sanity/notes";
import { isSanityConfigured, sanityClient } from "@/lib/sanity/client";
import type { NoteBodyBlock } from "@/lib/sanity/types";

type NoteForChat = {
  slug: string;
  title: string;
  publishedAt: string;
  takeaways?: string[];
  body?: NoteBodyBlock[];
};

const NOTE_PROJECTION = `{
  "slug": slug.current,
  title,
  publishedAt,
  takeaways,
  body[] {
    _type,
    heading,
    text,
    items,
    alt,
    caption,
    code,
    language,
    filename,
    headers,
    rows[] { cells }
  }
}`;

function chunksFromNote(note: NoteForChat): PortfolioChunk[] {
  const takeaways = (note.takeaways ?? []).join(" ");
  const body = bodyToPlainText(note.body);
  const text = [`Title: ${note.title}`, takeaways, body]
    .filter(Boolean)
    .join("\n\n");

  return chunksFromDocument({
    idPrefix: `note-${note.slug}`,
    title: note.title,
    text,
    source: "note",
    slug: note.slug,
    url: `/notes/${note.slug}`,
  });
}

export async function buildPortfolioChunks(): Promise<PortfolioChunk[]> {
  const about = buildAboutChunks();

  if (!isSanityConfigured()) {
    return about;
  }

  const notes = await sanityClient.fetch<NoteForChat[]>(
    `*[_type == "note" && defined(slug.current)] | order(publishedAt desc) ${NOTE_PROJECTION}`
  );

  const noteChunks = notes
    .filter((note) => isNoteLive(note.publishedAt))
    .flatMap(chunksFromNote);

  return [...about, ...noteChunks];
}

/** Chunks for one note only — used for incremental Pinecone upserts. */
export async function buildNoteChunksBySlug(
  slug: string
): Promise<PortfolioChunk[]> {
  if (!isSanityConfigured()) {
    throw new Error("Sanity is not configured");
  }

  const note = await sanityClient.fetch<NoteForChat | null>(
    `*[_type == "note" && slug.current == $slug][0] ${NOTE_PROJECTION}`,
    { slug }
  );

  if (!note) {
    throw new Error(`No Sanity note found for slug "${slug}"`);
  }

  if (!isNoteLive(note.publishedAt)) {
    throw new Error(
      `Note "${slug}" is scheduled for the future and is not indexed in production yet`
    );
  }

  return chunksFromNote(note);
}
