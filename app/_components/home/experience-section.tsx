import { BriefcaseBusiness, GraduationCap, HeartHandshake } from "lucide-react";

import { SectionHeading } from "@/app/_components/home/section-heading";
import { HoverCard, Reveal } from "@/components/home/motion";
import { communityHighlights, education, experiences } from "@/lib/home-content";

function TimelineList({
  items,
}: {
  items: {
    title: string;
    organization: string;
    period: string;
    description: string;
  }[];
}) {
  return (
    <div className="space-y-6">
      {items.map((item) => (
        <div
          key={`${item.title}-${item.organization}`}
          className="relative border-l border-border/70 pl-5"
        >
          <span className="absolute -left-[5px] top-1 h-2.5 w-2.5 rounded-full bg-[hsl(var(--accent-strong))]" />
          <p className="text-sm text-muted-foreground">{item.period}</p>
          <h3 className="mt-2 text-lg font-semibold">{item.title}</h3>
          <p className="text-sm font-medium text-foreground/80">
            {item.organization}
          </p>
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
}

export function ExperienceSection() {
  return (
    <section id="experience" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Experience"
            title="Hands-on delivery shaped by product work, teaching, and community involvement."
            description="My background combines product delivery, technical coaching, and community work, shaping how I build software and collaborate with teams."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <HoverCard className="rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
            <div className="flex items-center gap-3">
              <BriefcaseBusiness className="h-5 w-5 text-[hsl(var(--accent-strong))]" />
              <h3 className="text-xl font-semibold">Professional experience</h3>
            </div>
            <div className="mt-6">
              <TimelineList items={experiences} />
            </div>
          </HoverCard>
          <div className="grid gap-5">
            <HoverCard
              delay={0.05}
              className="rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-3">
                <GraduationCap className="h-5 w-5 text-[hsl(var(--accent-strong))]" />
                <h3 className="text-xl font-semibold">Education</h3>
              </div>
              <p className="mt-5 text-sm text-muted-foreground">
                {education.organization}
              </p>
              <p className="mt-2 text-lg font-semibold">{education.title}</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {education.description}
              </p>
            </HoverCard>
            <HoverCard
              delay={0.1}
              className="rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-3">
                <HeartHandshake className="h-5 w-5 text-[hsl(var(--accent-strong))]" />
                <h3 className="text-xl font-semibold">Community and mentoring</h3>
              </div>
              <div className="mt-6">
                <TimelineList items={communityHighlights} />
              </div>
            </HoverCard>
          </div>
        </div>
      </div>
    </section>
  );
}
