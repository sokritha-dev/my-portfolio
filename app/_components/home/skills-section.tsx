import { SkillsPanel } from "@/app/_components/home/skills-panel";
import { SectionHeading } from "@/app/_components/home/section-heading";
import { Reveal } from "@/components/home/motion";
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
        <div className="mt-12">
          <SkillsPanel groups={skillGroups} />
        </div>
      </div>
    </section>
  );
}
