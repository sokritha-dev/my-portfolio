import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { SiteNavigation } from "@/app/_components/site-navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAllNotes, getNoteBySlug } from "@/lib/notes-content";

type Props = {
  params: {
    slug: string;
  };
};

export function generateStaticParams() {
  return getAllNotes().map((note) => ({
    slug: note.slug,
  }));
}

export function generateMetadata({ params }: Props): Metadata {
  const note = getNoteBySlug(params.slug);

  if (!note) {
    return {
      title: "Note not found | Sokritha Yen",
    };
  }

  return {
    title: `${note.title} | Notes`,
    description: note.summary,
  };
}

export default function NoteDetailPage({ params }: Props) {
  const note = getNoteBySlug(params.slug);

  if (!note) {
    notFound();
  }

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8 lg:pl-24">
      <div className="mx-auto max-w-7xl">
        <SiteNavigation active="notes" />
        <article className="mt-6 rounded-[calc(var(--radius)*2)] border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] sm:p-10 lg:mt-0">
          <div className="flex flex-wrap gap-2">
            {note.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="mt-6 text-sm text-muted-foreground">{note.displayDate}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-5xl">
            {note.title}
          </h1>
          <p className="mt-5 text-base leading-7 text-muted-foreground sm:text-lg">
            {note.summary}
          </p>

          <div className="mt-10 space-y-10">
            {note.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {section.heading}
                </h2>
                <div className="mt-4 space-y-4 text-base leading-7 text-foreground/90">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets?.length ? (
                  <ul className="mt-5 space-y-3 text-base leading-7 text-foreground/90">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3">
                        <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-strong))]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </div>

          <div className="mt-12">
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/notes">Back to notes</Link>
            </Button>
          </div>
        </article>
      </div>
    </main>
  );
}
