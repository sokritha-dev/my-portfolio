import Link from "next/link";

import { FadeIn } from "@/components/home/motion";
import { heroContent, processRailSteps } from "@/lib/home-content";

export function HeroSection() {
  return (
    <section className="px-4 pb-12 pt-8 sm:px-8 sm:pb-16 sm:pt-14 lg:px-10">
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-12">
        <div className="hidden lg:block" aria-hidden />

        <div className="min-w-0 max-w-2xl">
          <FadeIn delay={1.85}>
            <div className="flex items-start gap-2.5 sm:items-center">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[hsl(var(--status-blue))] sm:mt-0"
                aria-hidden
              />
              <p className="text-sm leading-5 text-muted-foreground">
                {heroContent.badge}
              </p>
            </div>
          </FadeIn>

          <FadeIn delay={2.0}>
            <h1 className="mt-6 text-balance font-serif text-[2rem] font-semibold leading-[1.15] tracking-tight text-foreground sm:mt-8 sm:text-5xl lg:text-[3.5rem] lg:leading-[1.1]">
              {heroContent.title}
            </h1>
          </FadeIn>

          <FadeIn delay={2.1}>
            <p className="mt-4 text-base font-medium leading-snug text-foreground/85 sm:mt-5 sm:text-xl">
              {heroContent.subtitle}
            </p>
          </FadeIn>

          <FadeIn delay={2.2}>
            <p className="mt-4 max-w-xl text-[15px] leading-7 text-muted-foreground sm:mt-5 sm:text-base">
              {heroContent.description}
            </p>
          </FadeIn>

          <FadeIn delay={2.3}>
            <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center sm:gap-5">
              <Link
                href={heroContent.primaryCta.href}
                className="inline-flex w-full items-center justify-center border border-foreground px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-foreground hover:text-background sm:w-auto"
              >
                {heroContent.primaryCta.label}
              </Link>
              <Link
                href={heroContent.secondaryCta.href}
                target="_blank"
                className="text-center text-sm text-foreground underline underline-offset-4 decoration-foreground/40 transition-colors hover:decoration-foreground sm:text-left"
              >
                {heroContent.secondaryCta.label}
              </Link>
            </div>
          </FadeIn>

          <FadeIn delay={2.45}>
            <div className="mt-10 max-w-xl sm:mt-14">
              <div className="relative h-px bg-[hsl(var(--hairline))]">
                <span
                  className="hero-process-marker absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[hsl(var(--status-blue))]"
                  aria-hidden
                />
              </div>
              <div className="mt-3 grid grid-cols-4 gap-1 sm:gap-2">
                {processRailSteps.map((step) => (
                  <span
                    key={step}
                    className="text-center font-mono text-[9px] uppercase tracking-[0.04em] text-muted-foreground sm:text-[11px] sm:tracking-[0.08em]"
                  >
                    {step}
                  </span>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
