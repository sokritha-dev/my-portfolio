import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { HoverCard } from "@/components/home/motion";
import type { NotePreview } from "@/lib/sanity/notes";
import { cn } from "@/lib/utils";

type NoteCardProps = {
  note: NotePreview;
  index: number;
};

export function NoteCard({ note, index }: NoteCardProps) {
  return (
    <HoverCard
      delay={0.05 * index}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem]",
        "border border-border/45 bg-[hsl(var(--card)/0.85)] backdrop-blur-sm",
        "shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-300",
        "hover:border-[hsl(var(--accent-strong)/0.28)]",
        "hover:shadow-[0_28px_80px_-48px_hsl(var(--hero-glow)/0.55)]",
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[hsl(var(--hero-glow)/0.1)] to-transparent" />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent-strong)/0.35)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        <p className="text-xs tabular-nums text-muted-foreground">
          {note.displayDate}
        </p>
        <h2 className="mt-3 text-xl font-semibold tracking-tight sm:text-2xl">
          {note.title}
        </h2>
        <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
          {note.summary}
        </p>

        {note.tags.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-1.5">
            {note.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="rounded-full px-3 py-1 text-[11px]"
              >
                {tag}
              </Badge>
            ))}
          </div>
        ) : null}

        <Link
          href={`/notes/${note.slug}`}
          className="group/link mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[hsl(var(--accent-strong))] transition-colors hover:text-foreground"
        >
          Read note
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
        </Link>
      </div>
    </HoverCard>
  );
}
