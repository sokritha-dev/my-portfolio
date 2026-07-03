import Link from "next/link";
import { ArrowRight, Github, Sparkles } from "lucide-react";

import { MotionAccent } from "@/components/home/motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/home/motion";
import { featuredMetrics, heroContent } from "@/lib/home-content";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 pt-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="rounded-[calc(var(--radius)*2)] border border-border/60 bg-[hsl(var(--card)/0.72)] px-5 py-6 shadow-[var(--shadow-soft)] backdrop-blur sm:px-8">
          <div className="relative overflow-hidden rounded-[calc(var(--radius)*2)] border border-white/10 bg-[radial-gradient(circle_at_top,hsl(var(--hero-glow)/0.22),transparent_42%),linear-gradient(180deg,hsl(var(--hero-surface)),hsl(var(--card)))] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <div className="max-w-3xl">
              <Badge className="rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs font-medium text-foreground shadow-none">
                <Sparkles className="mr-2 h-3.5 w-3.5" />
                {heroContent.badge}
              </Badge>
              <h1 className="mt-6 max-w-4xl text-4xl font-semibold tracking-[-0.03em] text-balance sm:text-5xl lg:text-7xl">
                {heroContent.name}
              </h1>
              <p className="mt-4 max-w-3xl text-xl font-medium leading-snug tracking-tight text-foreground/90 text-balance sm:text-2xl lg:text-3xl">
                {heroContent.title}
              </p>
              <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {heroContent.description}
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <MotionAccent>
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-full px-6 shadow-[var(--shadow-soft)]"
                >
                  <Link href={heroContent.primaryCta.href}>
                    {heroContent.primaryCta.label}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </MotionAccent>
              <MotionAccent>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="h-12 rounded-full border-border/70 bg-background/70 px-6"
                >
                  <Link href={heroContent.secondaryCta.href} target="_blank">
                    {heroContent.secondaryCta.label}
                  </Link>
                </Button>
              </MotionAccent>
              <MotionAccent>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="h-12 rounded-full px-4 text-muted-foreground"
                >
                  <Link href="https://github.com/sokritha-dev" target="_blank">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </Link>
                </Button>
              </MotionAccent>
            </div>

            <Reveal
              delay={0.14}
              className="mt-12 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3"
            >
              {featuredMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4"
                >
                  <p className="text-2xl font-semibold tracking-tight">
                    {metric.value}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {metric.label}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
