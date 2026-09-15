import { SectionRail } from "@/app/_components/home/section-rail";
import { Stagger, StaggerItem } from "@/components/home/motion";
import { availabilityOptions } from "@/lib/home-content";

export function AvailabilitySection() {
  return (
    <SectionRail id="availability" label="Availability">
      <div className="relative border-l-2 border-[hsl(var(--status-blue)/0.55)] pl-6 sm:pl-8">
        <Stagger className="space-y-10">
          {availabilityOptions.map((option) => (
            <StaggerItem key={option.title}>
              <article>
                <h3 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
                  {option.title}
                </h3>
                <p className="mt-3 max-w-xl text-[15px] leading-7 text-muted-foreground">
                  {option.summary}
                </p>
                <ul className="mt-4 space-y-2">
                  {option.details.map((detail) => (
                    <li
                      key={detail}
                      className="flex gap-3 text-[15px] leading-6 text-muted-foreground"
                    >
                      <span
                        className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-foreground/70"
                        aria-hidden
                      />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </SectionRail>
  );
}
