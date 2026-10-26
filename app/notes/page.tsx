import type { Metadata } from "next";

import { NotesHeader } from "@/app/_components/notes/notes-header";
import { NotesIndex } from "@/app/_components/notes/notes-index";
import { SanitySetupNotice } from "@/app/_components/notes/sanity-setup-notice";
import { FadeIn } from "@/components/home/motion";
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
    <>
      <NotesHeader active="notes" />
      <main className="px-4 pb-16 pt-8 sm:px-8 sm:pb-24 sm:pt-12 lg:px-10">
        <div className="mx-auto max-w-5xl">
          <FadeIn>
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[hsl(var(--label-gold))] sm:text-xs">
              Technical Notes
            </p>
            <h1 className="mt-3 max-w-3xl font-serif text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-5xl">
              A place to keep what I learn, practice, and ship.
            </h1>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:mt-5 sm:text-base">
              Short technical notes, product lessons, and implementation
              reflections — written to document what I learn and hopefully help
              others too.
            </p>
          </FadeIn>

          {showDevSetup ? <SanitySetupNotice /> : null}

          {showDevEmptyState ? (
            <div className="mt-12 border-t border-[hsl(var(--hairline))] pt-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[hsl(var(--label-gold))] sm:text-xs">
                No notes yet
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                Publish your first note in Sanity Studio.
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">
                Run <code>npm run sanity:dev</code> or{" "}
                <code>npm run sanity:seed</code> to import the starter content.
              </p>
            </div>
          ) : null}

          {showPublicEmptyState ? (
            <div className="mt-12 border-t border-[hsl(var(--hairline))] pt-10">
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[hsl(var(--label-gold))] sm:text-xs">
                Coming soon
              </p>
              <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
                Notes are on the way.
              </h2>
              <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:text-base">
                I&apos;m writing up technical notes and product lessons. Check
                back soon.
              </p>
            </div>
          ) : null}

          {notes.length > 0 ? <NotesIndex notes={notes} /> : null}
        </div>
      </main>
    </>
  );
}
