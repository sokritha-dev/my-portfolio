import { contactLinks, heroContent } from "@/lib/home-content";
import { getAllNotes } from "@/lib/sanity/notes";

export type ChatSource = {
  kind: "note" | "page" | "contact";
  title: string;
  url: string;
  eyebrow: string;
  description?: string;
  meta?: string;
};

const CONTACT_CARD_COPY: Record<
  string,
  { description: string; meta: string }
> = {
  Email: {
    description: "sokritha.dev@gmail.com",
    meta: "Preferred",
  },
  LinkedIn: {
    description: "linkedin.com/in/sokritha-yen",
    meta: "Profile",
  },
  Resume: {
    description: "Download the latest PDF resume",
    meta: "PDF",
  },
};

function pushUnique(sources: ChatSource[], source: ChatSource) {
  if (sources.some((item) => item.url === source.url)) {
    return;
  }
  sources.push(source);
}

function shouldAttachContactCards(answer: string): boolean {
  return (
    /mailto:/i.test(answer) ||
    /sokritha\.dev@gmail\.com/i.test(answer) ||
    /linkedin\.com\/in\/sokritha/i.test(answer) ||
    /\/cv\.pdf/i.test(answer) ||
    /\[(?:Email|LinkedIn|Resume)\]\(/i.test(answer)
  );
}

function pushContactSources(sources: ChatSource[]) {
  for (const link of contactLinks) {
    const copy = CONTACT_CARD_COPY[link.label] ?? {
      description: link.href,
      meta: "Link",
    };
    pushUnique(sources, {
      kind: "contact",
      title: link.label,
      url: link.href,
      eyebrow: "Contact",
      description: copy.description,
      meta: copy.meta,
    });
  }
}

/**
 * Turn paths / contact mentions in the model answer into rich preview payloads
 * for the chat UI.
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

  if (shouldAttachContactCards(answer)) {
    pushContactSources(sources);
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

/** Soften raw markdown links in assistant text when contact cards are shown. */
export function simplifyAnswerForSources(
  answer: string,
  sources: ChatSource[]
): string {
  const hasContact = sources.some((source) => source.kind === "contact");
  if (!hasContact) {
    return answer;
  }

  return answer
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\s{2,}/g, " ")
    .trim();
}
