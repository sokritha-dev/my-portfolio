import { heroContent } from "@/lib/home-content";
import { getAllNotes } from "@/lib/sanity/notes";

export type ChatSource = {
  kind: "note" | "page";
  title: string;
  url: string;
  eyebrow: string;
  description?: string;
  meta?: string;
};

function pushUnique(sources: ChatSource[], source: ChatSource) {
  if (sources.some((item) => item.url === source.url)) {
    return;
  }
  sources.push(source);
}

/**
 * Turn paths mentioned in the model answer into rich preview payloads
 * (real note titles, dates, takeaways) for the chat UI.
 */
export async function resolveChatSources(answer: string): Promise<ChatSource[]> {
  const sources: ChatSource[] = [];
  const notes = await getAllNotes();
  const notePaths = answer.match(/\/notes\/[a-z0-9-]+/gi) ?? [];

  for (const path of notePaths) {
    const normalized = path.toLowerCase();
    const slug = normalized.replace("/notes/", "");
    const note = notes.find((item) => item.slug === slug);

    if (!note) {
      pushUnique(sources, {
        kind: "note",
        title: slug.replace(/-/g, " "),
        url: normalized,
        eyebrow: "Note",
      });
      continue;
    }

    const description =
      note.takeaways?.[0]?.trim() ||
      (note.tags.length > 0 ? note.tags.slice(0, 4).join(" · ") : undefined);

    pushUnique(sources, {
      kind: "note",
      title: note.title,
      url: normalized,
      eyebrow: note.series?.title
        ? `${note.series.title}${note.series.part ? ` · Part ${note.series.part}` : ""}`
        : "Note",
      description,
      meta: `${note.displayDate} · ${note.readingTimeLabel.replace(" read", "")}`,
    });
  }

  if (
    /(?:^|[\s(])\/notes(?:\/?(?=[\s).,]|$))/i.test(answer) ||
    /\bnotes (?:page|index|section)\b/i.test(answer)
  ) {
    pushUnique(sources, {
      kind: "page",
      title: "Notes",
      url: "/notes",
      eyebrow: "Index",
      description: "Technical writing on security, search, and building in public.",
      meta: `${notes.length} published`,
    });
  }

  if (
    sources.length === 0 &&
    (/\bhome page\b|\babout (?:page|me|him)\b|\bportfolio\b/i.test(answer) ||
      /(?:^|[\s(])\/(?:[\s).,]|$)/.test(answer))
  ) {
    pushUnique(sources, {
      kind: "page",
      title: heroContent.name,
      url: "/",
      eyebrow: "About",
      description: `${heroContent.title}. ${heroContent.subtitle}.`,
      meta: "Portfolio home",
    });
  }

  return sources;
}
