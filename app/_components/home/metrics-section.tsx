import { SectionRail } from "@/app/_components/home/section-rail";
import { Stagger, StaggerItem } from "@/components/home/motion";
import { featuredMetrics } from "@/lib/home-content";

export function MetricsSection() {
  return (
    <SectionRail label="By the numbers">
      <Stagger className="grid gap-6 sm:grid-cols-3 sm:gap-0">
        {featuredMetrics.map((metric, index) => (
          <StaggerItem
            key={metric.label}
            className={
              index === 0
                ? "border-b border-[hsl(var(--hairline))] pb-6 sm:border-b-0 sm:pb-0 sm:pr-8"
                : index === featuredMetrics.length - 1
                  ? "sm:border-l sm:border-[hsl(var(--hairline))] sm:pl-8"
                  : "border-b border-[hsl(var(--hairline))] pb-6 sm:border-b-0 sm:border-l sm:border-[hsl(var(--hairline))] sm:px-8 sm:pb-0"
            }
          >
            <p className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
              {metric.value}
            </p>
            <p className="mt-2 max-w-[14rem] text-sm leading-5 text-muted-foreground">
              {metric.label}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </SectionRail>
  );
}
