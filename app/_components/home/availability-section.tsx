import { Check } from "lucide-react";

import { SectionHeading } from "@/app/_components/home/section-heading";
import { Button } from "@/components/ui/button";
import { HoverCard, MotionAccent, Reveal } from "@/components/home/motion";
import { availabilityOptions } from "@/lib/home-content";

export function AvailabilitySection() {
  return (
    <section id="availability" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Availability"
            title="Ways we can work together depending on your goals and team needs."
            description="These options show the kinds of engagements I’m open to, from product delivery and frontend work to mentoring and technical guidance."
          />
        </Reveal>
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {availabilityOptions.map((option, index) => (
            <HoverCard
              key={option.title}
              delay={0.05 * index}
              className={[
                "rounded-3xl border p-6 shadow-[var(--shadow-soft)]",
                option.highlight
                  ? "border-[hsl(var(--accent-strong)/0.35)] bg-[linear-gradient(180deg,hsl(var(--accent-soft)/0.9),hsl(var(--card)))]"
                  : "border-border/60 bg-card",
              ].join(" ")}
            >
              <p className="text-sm font-medium uppercase tracking-[0.24em] text-[hsl(var(--accent-strong))]">
                {option.highlight ? "Best fit" : "Flexible option"}
              </p>
              <h3 className="mt-4 text-2xl font-semibold">{option.title}</h3>
              <p className="mt-4 text-sm leading-6 text-muted-foreground">
                {option.summary}
              </p>
              <ul className="mt-6 space-y-3">
                {option.details.map((detail) => (
                  <li key={detail} className="flex gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 text-[hsl(var(--accent-strong))]" />
                    <span>{detail}</span>
                  </li>
                ))}
              </ul>
              <MotionAccent className="mt-8">
                <Button
                  asChild
                  className="h-11 w-full rounded-full"
                  variant={option.highlight ? "default" : "outline"}
                >
                  <a href="mailto:sokritha.yen@gmail.com">
                    Start a conversation
                  </a>
                </Button>
              </MotionAccent>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}
