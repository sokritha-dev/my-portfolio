import { SectionRail } from "@/app/_components/home/section-rail";
import { Stagger, StaggerItem } from "@/components/home/motion";
import { skillGroups } from "@/lib/home-content";

export function SkillsSection() {
  return (
    <SectionRail id="skills" label="Skills">
      <Stagger className="grid grid-cols-2 gap-6 sm:gap-8 md:grid-cols-3 xl:grid-cols-4">
        {skillGroups.map((group) => (
          <StaggerItem key={group.category}>
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[hsl(var(--label-gold))]">
              {group.category}
            </p>
            <ul className="mt-3 space-y-1.5">
              {group.skills.map((skill) => (
                <li
                  key={skill}
                  className="text-[15px] leading-6 text-muted-foreground"
                >
                  {skill}
                </li>
              ))}
            </ul>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionRail>
  );
}
