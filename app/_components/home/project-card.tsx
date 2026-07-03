import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Fragment } from "react";

import { HoverCard } from "@/components/home/motion";
import type { Project } from "@/lib/home-content";
import { cn } from "@/lib/utils";

type ProjectCardProps = {
  project: Project;
  index: number;
};

function formatDescription(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      );
    }

    return <Fragment key={index}>{part}</Fragment>;
  });
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <HoverCard
      delay={0.06 * index}
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-[1.75rem]",
        "border border-border/45 bg-[hsl(var(--card)/0.85)] backdrop-blur-sm",
        "shadow-[var(--shadow-soft)] transition-[border-color,box-shadow] duration-300",
        "hover:border-[hsl(var(--accent-strong)/0.28)]",
        "hover:shadow-[0_28px_80px_-48px_hsl(var(--hero-glow)/0.55)]",
      )}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[hsl(var(--hero-glow)/0.1)] to-transparent" />
      <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent-strong)/0.35)] to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="relative flex flex-1 flex-col p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs tabular-nums text-muted-foreground">
              {project.date}
            </p>
            <h3 className="mt-2 text-xl font-semibold tracking-tight sm:text-[1.35rem]">
              {project.title}
            </h3>
            <p className="mt-1.5 text-sm leading-snug text-[hsl(var(--accent-strong))]">
              {project.category}
            </p>
          </div>
        </div>

        <p className="mt-4 flex-1 text-sm leading-7 text-muted-foreground">
          {formatDescription(project.description)}
        </p>

        <blockquote className="mt-5 border-l-2 border-[hsl(var(--accent-strong)/0.45)] pl-3.5 text-sm leading-6 text-foreground/85">
          {project.impact}
        </blockquote>

        <div className="mt-5 flex flex-wrap gap-1.5">
          {project.technologies.map((technology) => (
            <span
              key={technology}
              className="rounded-md bg-muted/45 px-2 py-1 text-[11px] font-medium text-muted-foreground"
            >
              {technology}
            </span>
          ))}
        </div>

        {project.link ? (
          <Link
            href={project.link}
            target="_blank"
            className="group/link mt-6 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-[hsl(var(--accent-strong))] transition-colors hover:text-foreground"
          >
            View project
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
          </Link>
        ) : null}
      </div>
    </HoverCard>
  );
}
