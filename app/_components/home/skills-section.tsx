import { SectionHeading } from "@/app/_components/home/section-heading";
import { Badge } from "@/components/ui/badge";
import { HoverCard, Reveal } from "@/components/home/motion";
import { skillGroups } from "@/lib/home-content";

export function SkillsSection() {
  return (
    <section id="skills" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Capabilities"
            title="A practical skill set across frontend, backend, cloud, and mentoring."
            description="These capabilities reflect the mix of technical depth and team-oriented skills I use to deliver products from idea to production."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {skillGroups.map((group, index) => (
            <HoverCard
              key={group.category}
              delay={0.05 * index}
              className="rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]"
            >
              <h3 className="text-lg font-semibold">{group.category}</h3>
              <div className="mt-5 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="rounded-full px-3 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}
