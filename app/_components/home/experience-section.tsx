import { SectionRail } from "@/app/_components/home/section-rail";
import { Stagger, StaggerItem } from "@/components/home/motion";
import {
  communityHighlights,
  education,
  experiences,
} from "@/lib/home-content";

export function ExperienceSection() {
  return (
    <SectionRail id="experience" label="Experience">
      <div className="space-y-12">
        <Stagger className="space-y-10">
          {experiences.map((item) => (
            <StaggerItem key={`${item.title}-${item.organization}`}>
              <article>
                <p className="text-sm text-muted-foreground">{item.period}</p>
                <h3 className="mt-2 font-serif text-xl font-semibold tracking-tight sm:text-2xl">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm font-medium text-foreground/80">
                  {item.organization}
                </p>
                <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">
                  {item.description}
                </p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>

        <Stagger>
          <StaggerItem className="border-t border-[hsl(var(--hairline))] pt-10">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[hsl(var(--label-gold))]">
              Education
            </p>
            <h3 className="mt-3 font-serif text-xl font-semibold tracking-tight">
              {education.title}
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {education.organization}
            </p>
            <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">
              {education.description}
            </p>
          </StaggerItem>
        </Stagger>

        <div className="border-t border-[hsl(var(--hairline))] pt-10">
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[hsl(var(--label-gold))]">
            Community & volunteering
          </p>
          <Stagger className="mt-6 space-y-8">
            {communityHighlights.map((item) => (
              <StaggerItem key={`${item.title}-${item.organization}`}>
                <article>
                  <p className="text-sm text-muted-foreground">{item.period}</p>
                  <h3 className="mt-2 font-serif text-lg font-semibold tracking-tight">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-medium text-foreground/80">
                    {item.organization}
                  </p>
                  <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground">
                    {item.description}
                  </p>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </SectionRail>
  );
}
