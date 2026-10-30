import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import type { ChatSource } from "@/lib/chat/sources";

type SourceLinkCardProps = {
  source: ChatSource;
};

export function SourceLinkCard({ source }: SourceLinkCardProps) {
  return (
    <Link
      href={source.url}
      className="group block border border-[hsl(var(--hairline))] bg-[hsl(var(--card))] px-3 py-2.5 transition-colors hover:border-foreground/25 hover:bg-[hsl(var(--muted)/0.45)]"
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-[hsl(var(--label-gold))]">
          {source.eyebrow}
          {source.meta ? (
            <>
              <span className="mx-1.5 text-muted-foreground/40" aria-hidden>
                ·
              </span>
              <span className="normal-case tracking-normal text-muted-foreground">
                {source.meta}
              </span>
            </>
          ) : null}
        </p>
        <ArrowUpRight
          className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground"
          aria-hidden
        />
      </div>
      <p className="mt-1 font-serif text-[13px] font-semibold leading-snug tracking-tight text-foreground">
        {source.title}
      </p>
      {source.description ? (
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted-foreground">
          {source.description}
        </p>
      ) : null}
      <p className="mt-1.5 text-[10px] tabular-nums text-muted-foreground/80">
        {source.url}
      </p>
    </Link>
  );
}
