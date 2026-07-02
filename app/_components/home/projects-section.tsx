import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

import { SectionHeading } from "@/app/_components/home/section-heading";
import { Badge } from "@/components/ui/badge";
import { HoverCard, Reveal } from "@/components/home/motion";
import { featuredProjects } from "@/lib/home-content";

function ProjectGrid({
  title,
  description,
  projects,
}: {
  title: string;
  description: string;
  projects: typeof featuredProjects;
}) {
  return (
    <div>
      <div className="max-w-2xl">
        <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {projects.map((project, index) => (
          <HoverCard
            key={project.title}
            delay={0.06 * index}
            className="flex h-full flex-col rounded-3xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-[hsl(var(--accent-strong))]">
                  {project.category}
                </p>
                <h3 className="mt-2 text-xl font-semibold">{project.title}</h3>
              </div>
              {project.link ? (
                <Link
                  href={project.link}
                  target="_blank"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label={`Open ${project.title}`}
                >
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : null}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">{project.date}</p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {project.description}
            </p>
            <p className="mt-4 rounded-2xl border border-border/60 bg-muted/40 p-4 text-sm leading-6 text-foreground/90">
              {project.impact}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {project.technologies.map((technology) => (
                <Badge
                  key={technology}
                  variant="secondary"
                  className="rounded-full px-3 py-1"
                >
                  {technology}
                </Badge>
              ))}
            </div>
          </HoverCard>
        ))}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const professionalProjects = featuredProjects.filter(
    (project) => project.group === "professional"
  );
  const personalProjects = featuredProjects.filter(
    (project) => project.group === "personal"
  );

  return (
    <section id="work" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Featured projects with real product and platform depth."
            description="A mix of professional and personal projects that shows how I approach product development, technical depth, and real-world outcomes."
          />
        </Reveal>
        <div className="mt-12 space-y-14">
          <ProjectGrid
            title="Professional Projects"
            description="Production work delivered for companies and teams, including revenue-generating products, internal platforms, and search-related systems."
            projects={professionalProjects}
          />
          <ProjectGrid
            title="Personal Projects"
            description="Independent projects where I explore ideas, build products from scratch, and experiment with new technical directions."
            projects={personalProjects}
          />
        </div>
      </div>
    </section>
  );
}
