import Link from "next/link";
import type { Metadata } from "next";

import { SectionHeading } from "@/app/_components/home/section-heading";
import { SiteNavigation } from "@/app/_components/site-navigation";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Notes | Sokritha Yen",
  description:
    "Technical notes, product lessons, and practical learnings from building software.",
};

export default function NotesPage() {
  return (
    <main className="px-4 py-10 sm:px-6 lg:px-8 lg:pl-24">
      <div className="mx-auto max-w-7xl">
        <SiteNavigation active="notes" />
        <div className="mt-6 lg:mt-0">
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

          <div className="mt-12 rounded-[calc(var(--radius)*2)] border border-dashed border-border/70 bg-card/60 px-6 py-16 text-center shadow-[var(--shadow-soft)] sm:px-10">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-[hsl(var(--accent-strong))]">
              Coming Soon
            </p>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Technical notes are on the way.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
              I plan to publish notes here regularly to capture what I learn,
              what I practice, and what might be helpful for other developers.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
