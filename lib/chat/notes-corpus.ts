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

export async function buildPortfolioChunks(): Promise<PortfolioChunk[]> {
  const about = buildAboutChunks();

  if (!isSanityConfigured()) {
    return about;
  }

  const notes = await sanityClient.fetch<NoteForChat[]>(
    `*[_type == "note" && defined(slug.current)] | order(publishedAt desc) {
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
    }`
  );

  const noteChunks = notes
    .filter((note) => isNoteLive(note.publishedAt))
    .flatMap((note) => {
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
    });

  return [...about, ...noteChunks];
}
