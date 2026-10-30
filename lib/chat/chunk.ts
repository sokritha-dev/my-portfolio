import { CHAT_CHUNK_OVERLAP, CHAT_CHUNK_SIZE } from "@/lib/chat/config";

export type PortfolioChunk = {
  id: string;
  text: string;
  title: string;
  source: "note" | "about";
  slug?: string;
  url: string;
};

/** Split long text into overlapping chunks for embedding. */
export function chunkText(
  text: string,
  options?: { size?: number; overlap?: number }
): string[] {
  const size = options?.size ?? CHAT_CHUNK_SIZE;
  const overlap = options?.overlap ?? CHAT_CHUNK_OVERLAP;
  const normalized = text.replace(/\s+/g, " ").trim();

  if (!normalized) {
    return [];
  }

  if (normalized.length <= size) {
    return [normalized];
  }

  const chunks: string[] = [];
  let start = 0;

  while (start < normalized.length) {
    const end = Math.min(start + size, normalized.length);
    chunks.push(normalized.slice(start, end).trim());
    if (end >= normalized.length) {
      break;
    }
    start = Math.max(0, end - overlap);
  }

  return chunks.filter(Boolean);
}

export function chunksFromDocument(input: {
  idPrefix: string;
  title: string;
  text: string;
  source: "note" | "about";
  slug?: string;
  url: string;
}): PortfolioChunk[] {
  return chunkText(input.text).map((text, index) => ({
    id: `${input.idPrefix}-${index}`,
    text,
    title: input.title,
    source: input.source,
    slug: input.slug,
    url: input.url,
  }));
}
