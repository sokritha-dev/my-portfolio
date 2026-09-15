import Link from "next/link";

import { SectionRail } from "@/app/_components/home/section-rail";
import { Stagger, StaggerItem } from "@/components/home/motion";
import { featuredProjects, type Project } from "@/lib/home-content";

function ProjectBlock({ project }: { project: Project }) {
  return (
    <article className="border-t border-[hsl(var(--hairline))] py-16 first:border-t-0 first:pt-0 last:pb-2 sm:py-20 sm:last:pb-4">
      <h3 className="font-serif text-2xl font-semibold tracking-tight sm:text-3xl">
        {project.title}
      </h3>
      <p className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground sm:block">
        <span>{project.category}</span>
        <span className="hidden text-muted-foreground/50 sm:inline"> | </span>
        <span>{project.date}</span>
      </p>
      <p className="mt-4 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:mt-5">
        {project.description}
      </p>
      <p className="mt-3 max-w-2xl text-[15px] leading-7 text-muted-foreground sm:mt-4">
        {project.impact}
      </p>
      <p className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground/80 sm:mt-5 sm:gap-x-4">
        {project.technologies.map((tech) => (
          <span key={tech}>{tech}</span>
        ))}
      </p>
      {project.link ? (
        <Link
          href={project.link}
          target="_blank"
          rel="noreferrer"
          className="mt-4 inline-block text-sm text-foreground underline underline-offset-4 decoration-foreground/35 hover:decoration-foreground sm:mt-5"
        >
          View project
        </Link>
      ) : null}
    </article>
  );
}

function ProjectGroup({
  title,
  projects,
}: {
  title: string;
  projects: Project[];
}) {
  if (projects.length === 0) return null;

  return (
    <div className="mb-16 last:mb-0 sm:mb-20">
      <p className="mb-3 text-xs font-medium uppercase tracking-[0.12em] text-[hsl(var(--label-gold))] sm:mb-4">
        {title}
      </p>
      <Stagger className="space-y-2 sm:space-y-4">
        {projects.map((project) => (
          <StaggerItem key={project.title}>
            <ProjectBlock project={project} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}

export function ProjectsSection() {
  const professional = featuredProjects.filter(
    (project) => project.group === "professional"
  );
  const personal = featuredProjects.filter(
    (project) => project.group === "personal"
  );

  return (
    <SectionRail id="work" label="Selected work">
      <ProjectGroup title="Professional" projects={professional} />
      <ProjectGroup title="Personal" projects={personal} />
    </SectionRail>
  );
}
