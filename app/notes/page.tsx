import Link from "next/link";
import type { Metadata } from "next";

import { NoteCard } from "@/app/_components/notes/note-card";
import { SanitySetupNotice } from "@/app/_components/notes/sanity-setup-notice";
import { SectionHeading } from "@/app/_components/home/section-heading";
import { SiteNavigation } from "@/app/_components/site-navigation";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/motion";
import { isSanityConfigured } from "@/lib/sanity/client";
import { getAllNotes } from "@/lib/sanity/notes";

export const metadata: Metadata = {
  title: "Notes | Sokritha Yen",
  description:
    "Technical notes, product lessons, and practical learnings from building software.",
};

export default async function NotesPage() {
  const notes = await getAllNotes();
  const sanityReady = isSanityConfigured();
  const isProduction = process.env.NODE_ENV === "production";
  const showDevSetup = !isProduction && !sanityReady;
  const showDevEmptyState = !isProduction && sanityReady && notes.length === 0;
  const showPublicEmptyState = isProduction && notes.length === 0;

  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8 lg:pl-24">
      <div className="mx-auto max-w-7xl">
        <SiteNavigation active="notes" />
        <div className="mt-6 lg:mt-0">
          <Reveal>
            <div className="rounded-[calc(var(--radius)*2)] border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)] sm:p-10">
              <SectionHeading
                eyebrow="Technical Notes"
                title="A place to keep what I learn, practice, and ship."
                description="Short technical notes, product lessons, and implementation reflections that help me document what I learn and hopefully help others too."
              />
              <div className="mt-8">
                <Button asChild variant="outline" className="rounded-full">
                  <Link href="/">Back to portfolio</Link>
                </Button>
              </div>
            </div>
          </Reveal>

          {showDevSetup ? <SanitySetupNotice /> : null}

          {showDevEmptyState ? (
            <div className="mt-12 rounded-[calc(var(--radius)*2)] border border-dashed border-border/70 bg-card/60 px-6 py-16 text-center shadow-[var(--shadow-soft)] sm:px-10">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-[hsl(var(--accent-strong))]">
                No notes yet
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Publish your first note in Sanity Studio.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                Run <code>npm run sanity:dev</code> or{" "}
                <code>npm run sanity:seed</code> to import the starter content.
              </p>
            </div>
          ) : null}

          {showPublicEmptyState ? (
            <div className="mt-12 rounded-[calc(var(--radius)*2)] border border-dashed border-border/70 bg-card/60 px-6 py-16 text-center shadow-[var(--shadow-soft)] sm:px-10">
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-[hsl(var(--accent-strong))]">
                Coming soon
              </p>
              <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
                Notes are on the way.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                I&apos;m writing up technical notes and product lessons. Check
                back soon.
              </p>
            </div>
          ) : null}

          {notes.length > 0 ? (
            <div className="mt-12 grid gap-6 lg:grid-cols-3">
              {notes.map((note, index) => (
                <NoteCard key={note.slug} note={note} index={index} />
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
