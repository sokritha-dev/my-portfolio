import { SectionRail } from "@/app/_components/home/section-rail";
import { Stagger, StaggerItem } from "@/components/home/motion";
import { valuePillars } from "@/lib/home-content";

export function FeaturesSection() {
  return (
    <SectionRail label="Approach">
      <Stagger className="space-y-0">
        {valuePillars.map((pillar, index) => (
          <StaggerItem
            key={pillar.title}
            className={
              index === 0
                ? "pb-10"
                : "border-t border-[hsl(var(--hairline))] py-10 last:pb-0"
            }
          >
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[hsl(var(--label-gold))]">
              {pillar.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
              {pillar.title}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground">
              {pillar.description}
            </p>
            <ul className="mt-5 space-y-2.5">
              {pillar.bullets.map((bullet) => (
                <li
                  key={bullet}
                  className="flex gap-3 text-[15px] leading-6 text-muted-foreground"
                >
                  <span
                    className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-foreground/70"
                    aria-hidden
                  />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionRail>
  );
}
