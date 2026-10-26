import type { NoteTocHeading } from "@/lib/sanity/types";

type NoteTocProps = {
  headings: NoteTocHeading[];
};

export function NoteToc({ headings }: NoteTocProps) {
  if (headings.length < 2) {
    return null;
  }

  return (
    <nav aria-label="On this page" className="text-sm">
      <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[hsl(var(--label-gold))] sm:text-xs">
        On this page
      </p>
      <ul className="mt-3 space-y-2.5 border-l border-[hsl(var(--hairline))] pl-3">
        {headings.map((heading) => (
          <li key={heading.id}>
            <a
              href={`#${heading.id}`}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              {heading.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
