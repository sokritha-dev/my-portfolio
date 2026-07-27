import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { NoteSections } from "@/app/_components/notes/note-sections";
import { SiteNavigation } from "@/app/_components/site-navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getNoteBySlug, getNoteSlugs } from "@/lib/sanity/notes";
import { isSanityConfigured } from "@/lib/sanity/client";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export const dynamicParams = false;

export async function generateStaticParams() {
  if (!isSanityConfigured()) {
    return [{ slug: "preview" }];
  }

  const slugs = await getNoteSlugs();

  if (slugs.length === 0) {
    return [{ slug: "preview" }];
  }

  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const note = await getNoteBySlug(slug);

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

export default async function NoteDetailPage({ params }: Props) {
  const { slug } = await params;

  if (slug === "preview") {
    notFound();
  }

  const note = await getNoteBySlug(slug);

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

          <NoteSections sections={note.sections} />

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
