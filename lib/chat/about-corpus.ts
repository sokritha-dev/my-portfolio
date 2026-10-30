import {
  experiences,
  featuredProjects,
  heroContent,
  valuePillars,
} from "@/lib/home-content";
import { chunksFromDocument, type PortfolioChunk } from "@/lib/chat/chunk";

function projectsText(): string {
  return featuredProjects
    .map((project) =>
      [
        `Project: ${project.title}`,
        `Type: ${project.group} · ${project.category}`,
        `Timeline / how long worked on ${project.title}: ${project.date}`,
        project.description,
        project.impact,
        `Tech: ${project.technologies.join(", ")}`,
        project.link ? `Link: ${project.link}` : null,
      ]
        .filter(Boolean)
        .join("\n")
    )
    .join("\n\n");
}

function experienceText(): string {
  return experiences
    .map(
      (item) =>
        `${item.title} at ${item.organization} (${item.period}): ${item.description}`
    )
    .join("\n\n");
}

function pillarsText(): string {
  return valuePillars
    .map(
      (pillar) =>
        `${pillar.title}: ${pillar.description} ${pillar.bullets.join(" ")}`
    )
    .join("\n\n");
}

/** One chunk per project so semantic search can retrieve timelines. */
function buildProjectChunks(): PortfolioChunk[] {
  return featuredProjects.flatMap((project, index) =>
    chunksFromDocument({
      idPrefix: `project-${index}-${project.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")}`,
      title: `Project: ${project.title}`,
      text: [
        `Project name: ${project.title}`,
        `How long / timeline for ${project.title}: ${project.date}`,
        `Category: ${project.group} · ${project.category}`,
        project.description,
        project.impact,
        `Technologies: ${project.technologies.join(", ")}`,
        project.link ? `URL: ${project.link}` : null,
      ]
        .filter(Boolean)
        .join("\n"),
      source: "about",
      url: "/",
    })
  );
}

/** About + project chunks for Pinecone (used by search_notes tool). */
export function buildAboutChunks(): PortfolioChunk[] {
  const about = [
    `Name: ${heroContent.name}`,
    `Role: ${heroContent.title}`,
    `Years of web development experience: 4+ years (${heroContent.subtitle})`,
    heroContent.description,
    `Contact email: sokritha.dev@gmail.com`,
    "",
    "Focus areas:",
    pillarsText(),
    "",
    "Experience:",
    experienceText(),
    "",
    `Featured projects count: ${featuredProjects.length}`,
    "Projects:",
    projectsText(),
  ].join("\n");

  return [
    ...chunksFromDocument({
      idPrefix: "about",
      title: "About Yen Sokritha",
      text: about,
      source: "about",
      url: "/",
    }),
    ...buildProjectChunks(),
  ];
}
