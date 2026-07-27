import type { NoteSection } from "@/lib/sanity/types";

type NoteSectionsProps = {
  sections: NoteSection[];
};

export function NoteSections({ sections }: NoteSectionsProps) {
  return (
    <div className="mt-10 space-y-10">
      {sections.map((section) => (
        <section key={section.heading}>
          <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
            {section.heading}
          </h2>
          <div className="mt-4 space-y-4 text-base leading-7 text-foreground/90">
            {section.paragraphs?.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          {section.bullets?.length ? (
            <ul className="mt-5 space-y-3 text-base leading-7 text-foreground/90">
              {section.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-3">
                  <span className="mt-3 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-strong))]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          ) : null}
        </section>
      ))}
    </div>
  );
}
