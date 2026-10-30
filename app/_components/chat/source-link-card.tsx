import Link from "next/link";
import { ArrowUpRight, FileText, Linkedin, Mail } from "lucide-react";
import type { ReactNode } from "react";

import type { ChatSource } from "@/lib/chat/sources";

type SourceLinkCardProps = {
  source: ChatSource;
};

function isExternalUrl(url: string): boolean {
  return (
    url.startsWith("http://") ||
    url.startsWith("https://") ||
    url.startsWith("mailto:") ||
    url.endsWith(".pdf")
  );
}

function displayUrl(url: string): string {
  if (url.startsWith("mailto:")) {
    return url.slice("mailto:".length);
  }
  return url.replace(/^https?:\/\//i, "");
}

function ContactIcon({ title }: { title: string }): ReactNode {
  switch (title) {
    case "Email":
      return <Mail className="h-3.5 w-3.5" aria-hidden />;
    case "LinkedIn":
      return <Linkedin className="h-3.5 w-3.5" aria-hidden />;
    case "Resume":
      return <FileText className="h-3.5 w-3.5" aria-hidden />;
    default:
      return <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />;
  }
}

export function SourceLinkCard({ source }: SourceLinkCardProps) {
  const external = isExternalUrl(source.url);
  const className =
    "group block border border-[hsl(var(--hairline))] bg-[hsl(var(--card))] px-3 py-2.5 transition-colors hover:border-foreground/25 hover:bg-[hsl(var(--muted)/0.45)]";

  const body = (
    <>
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
        <span className="mt-0.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground">
          {source.kind === "contact" ? (
            <ContactIcon title={source.title} />
          ) : (
            <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
          )}
        </span>
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
        {displayUrl(source.url)}
      </p>
    </>
  );

  if (external) {
    return (
      <a
        href={source.url}
        className={className}
        target={source.url.startsWith("mailto:") ? undefined : "_blank"}
        rel={
          source.url.startsWith("mailto:")
            ? undefined
            : "noopener noreferrer"
        }
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={source.url} className={className}>
      {body}
    </Link>
  );
}
