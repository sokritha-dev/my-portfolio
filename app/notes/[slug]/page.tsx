import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { NoteBody } from "@/app/_components/notes/note-body";
import { NoteMeta } from "@/app/_components/notes/note-meta";
import {
  NoteSeriesLabel,
  NoteSeriesPager,
} from "@/app/_components/notes/note-series-nav";
import { NoteTakeaways } from "@/app/_components/notes/note-takeaways";
import { NoteToc } from "@/app/_components/notes/note-toc";
import { NotesHeader } from "@/app/_components/notes/notes-header";
import {
  getNoteBySlug,
  getNoteSlugs,
  noteSeoDescription,
} from "@/lib/sanity/notes";
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
    description: noteSeoDescription(note),
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

  const takeaways = note.takeaways ?? [];
  const showToc = note.toc.length >= 2;

  return (
    <>
      <NotesHeader active="notes" />
      <main className="px-4 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-12 lg:px-10">
        <article className="mx-auto max-w-5xl">
          <div
            className={
              showToc
                ? "lg:grid lg:grid-cols-[minmax(0,1fr)_11rem] lg:gap-12 xl:grid-cols-[minmax(0,1fr)_12rem] xl:gap-16"
                : undefined
            }
          >
            <div className="min-w-0 max-w-2xl">
              {showToc ? (
                <div className="mb-8 lg:hidden">
                  <NoteToc headings={note.toc} />
                </div>
              ) : null}

              {note.seriesNav ? (
                <div className="mb-4">
                  <NoteSeriesLabel seriesNav={note.seriesNav} />
                </div>
              ) : null}

              <NoteMeta
                displayDate={note.displayDate}
                readingTimeLabel={note.readingTimeLabel}
                tags={note.tags}
              />
              <h1 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-tight text-balance sm:mt-5 sm:text-5xl">
                {note.title}
              </h1>

              <div className="mt-8">
                <NoteTakeaways takeaways={takeaways} />
              </div>

              <NoteBody body={note.body} toc={note.toc} />

              {note.seriesNav ? (
                <NoteSeriesPager seriesNav={note.seriesNav} />
              ) : null}

              <div className="mt-12 border-t border-[hsl(var(--hairline))] pt-8">
                <Link
                  href="/notes"
                  className="text-sm text-foreground underline underline-offset-4 decoration-foreground/40 transition-colors hover:decoration-foreground"
                >
                  Back to notes
                </Link>
              </div>
            </div>

            {showToc ? (
              <aside className="relative hidden lg:block">
                <div className="sticky top-24">
                  <NoteToc headings={note.toc} />
                </div>
              </aside>
            ) : null}
          </div>
        </article>
      </main>
    </>
  );
}
