import { ProjectCard } from "@/app/_components/home/project-card";
import { SectionHeading } from "@/app/_components/home/section-heading";
import { Reveal } from "@/components/home/motion";
import type { Project } from "@/lib/home-content";
import { featuredProjects } from "@/lib/home-content";

function ProjectGroup({
  title,
  description,
  projects,
}: {
  title: string;
  description: string;
  projects: Project[];
}) {
  return (
    <div>
      <div className="max-w-2xl">
        <h3 className="text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
          {description}
        </p>
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.title} project={project} index={index} />
        ))}
      </div>
    </div>
  );
}

export function ProjectsSection() {
  const professionalProjects = featuredProjects.filter(
    (project) => project.group === "professional",
  );
  const personalProjects = featuredProjects.filter(
    (project) => project.group === "personal",
  );

  return (
    <section id="work" className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionHeading
            eyebrow="Selected work"
            title="Projects with real product and platform depth."
            description="Professional work shipped for companies and teams, plus personal products built independently."
          />
        </Reveal>
        <div className="mt-12 space-y-14">
          <ProjectGroup
            title="Professional work"
            description="Production systems delivered for companies — from solo-built products to team contributions on platforms and search."
            projects={professionalProjects}
          />
          <ProjectGroup
            title="Personal projects"
            description="Independent products where I explore ideas, ship end-to-end, and experiment with new technical directions."
            projects={personalProjects}
          />
        </div>
      </div>
    </section>
  );
}
