import Image from "next/image";

import { urlForImage } from "@/lib/sanity/image";
import type { NoteBodyBlock, NoteTocHeading } from "@/lib/sanity/types";

type NoteBodyProps = {
  body: NoteBodyBlock[];
  toc: NoteTocHeading[];
};

function headingIdFor(
  heading: string,
  toc: NoteTocHeading[],
  occurrence: Map<string, number>
): string {
  const count = occurrence.get(heading) ?? 0;
  occurrence.set(heading, count + 1);
  const matches = toc.filter((item) => item.label === heading);
  return matches[count]?.id ?? matches[0]?.id ?? "section";
}

export function NoteBody({ body, toc }: NoteBodyProps) {
  const headingOccurrence = new Map<string, number>();

  return (
    <div className="mt-10 space-y-8">
      {body.map((block) => {
        switch (block._type) {
          case "noteHeading": {
            const id = headingIdFor(block.heading, toc, headingOccurrence);
            return (
              <h2
                key={block._key}
                id={id}
                className="scroll-mt-24 font-serif text-xl font-semibold tracking-tight sm:text-2xl"
              >
                {block.heading}
              </h2>
            );
          }
          case "noteParagraph":
            return (
              <p
                key={block._key}
                className="text-[15px] leading-7 text-foreground/90 sm:text-base sm:leading-8"
              >
                {block.text}
              </p>
            );
          case "noteBullets":
            return (
              <ul
                key={block._key}
                className="space-y-3 text-[15px] leading-7 text-foreground/90 sm:text-base sm:leading-8"
              >
                {(block.items ?? []).map((item) => (
                  <li key={item} className="flex gap-3">
                    <span
                      className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-foreground"
                      aria-hidden
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );
          case "noteTable": {
            const headers = block.headers ?? [];
            const rows = block.rows ?? [];

            if (headers.length === 0 || rows.length === 0) {
              return null;
            }

            return (
              <figure key={block._key} className="space-y-2">
                <div className="overflow-x-auto border border-[hsl(var(--hairline))]">
                  <table className="w-full min-w-[28rem] border-collapse text-left text-[13px] leading-6 sm:text-sm sm:leading-7">
                    <thead>
                      <tr className="border-b border-[hsl(var(--hairline))] bg-[hsl(var(--muted)/0.55)]">
                        {headers.map((header) => (
                          <th
                            key={header}
                            scope="col"
                            className="px-3 py-2.5 font-medium text-foreground sm:px-4"
                          >
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, rowIndex) => (
                        <tr
                          key={row._key ?? `row-${rowIndex}`}
                          className="border-b border-[hsl(var(--hairline))] last:border-b-0"
                        >
                          {(row.cells ?? []).map((cell, cellIndex) => (
                            <td
                              key={`${rowIndex}-${cellIndex}`}
                              className="px-3 py-2.5 align-top text-foreground/90 sm:px-4"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {block.caption ? (
                  <figcaption className="text-sm italic text-muted-foreground">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          }
          case "noteImage": {
            const asset = block.image?.asset;
            let src: string | null = asset?.url ?? null;

            if (!src && block.image) {
              try {
                src = urlForImage(block.image).width(1600).url();
              } catch {
                src = null;
              }
            }

            if (!src) {
              return null;
            }

            const width = asset?.metadata?.dimensions?.width || 1600;
            const height = asset?.metadata?.dimensions?.height || 900;

            return (
              <figure key={block._key} className="space-y-2">
                <Image
                  src={src}
                  alt={block.alt}
                  width={width}
                  height={height}
                  className="h-auto w-full bg-[hsl(var(--muted))]"
                  sizes="(max-width: 768px) 100vw, 42rem"
                />
                {block.caption ? (
                  <figcaption className="text-sm italic text-muted-foreground">
                    {block.caption}
                  </figcaption>
                ) : null}
              </figure>
            );
          }
          case "noteCode": {
            if (!block.code?.trim()) {
              return null;
            }

            const label = block.filename || block.language;

            return (
              <figure
                key={block._key}
                className="overflow-hidden border border-[hsl(var(--hairline))] bg-[hsl(var(--muted)/0.45)]"
              >
                {label ? (
                  <figcaption className="border-b border-[hsl(var(--hairline))] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.08em] text-muted-foreground">
                    {label}
                  </figcaption>
                ) : null}
                <pre className="overflow-x-auto p-4 text-[13px] leading-6 sm:text-sm sm:leading-7">
                  <code className="font-mono text-foreground/90">
                    {block.code.replace(/\n$/, "")}
                  </code>
                </pre>
              </figure>
            );
          }
          default: {
            const _exhaustive: never = block;
            void _exhaustive;
            return null;
          }
        }
      })}
    </div>
  );
}
