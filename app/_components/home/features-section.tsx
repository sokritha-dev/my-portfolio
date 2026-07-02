import { Layers3, Rocket, Users2 } from "lucide-react";

import { SectionHeading } from "@/app/_components/home/section-heading";
import { HoverCard, Reveal } from "@/components/home/motion";
import { valuePillars } from "@/lib/home-content";

const icons = [Rocket, Layers3, Users2];

export function FeaturesSection() {
  return (
    <section id="strengths" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Strengths"
            title="The strengths I bring to product teams and modern web projects."
            description="From product thinking to full-stack execution and mentoring, these are the areas where I create the most value for teams and digital products."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {valuePillars.map((pillar, index) => {
            const Icon = icons[index];

            return (
              <HoverCard
                key={pillar.title}
                delay={0.05 * index}
                className="rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent-strong))]">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-5 text-xs font-medium uppercase tracking-[0.24em] text-[hsl(var(--accent-strong))]">
                  {pillar.eyebrow}
                </p>
                <h3 className="mt-3 text-xl font-semibold">{pillar.title}</h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {pillar.description}
                </p>
                <ul className="mt-5 space-y-3 text-sm text-foreground/90">
                  {pillar.bullets.map((bullet) => (
                    <li key={bullet} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[hsl(var(--accent-strong))]" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </HoverCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
