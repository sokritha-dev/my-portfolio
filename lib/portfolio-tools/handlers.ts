import {
  contactLinks,
  education,
  experiences,
  featuredMetrics,
  featuredProjects,
  heroContent,
  skillGroups,
  valuePillars,
} from "@/lib/home-content";
import { bodyToPlainText, getAllNotes, getNoteBySlug } from "@/lib/sanity/notes";
import { requireChatEnv, CHAT_TOP_K } from "@/lib/chat/config";
import { embedQuery } from "@/lib/chat/embeddings";
import { queryPortfolioChunks } from "@/lib/chat/pinecone";

function normalize(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

async function getPortfolioStats() {
  const notes = await getAllNotes();
  return {
    person: {
      name: heroContent.name,
      role: heroContent.title,
      subtitle: heroContent.subtitle,
      bio: heroContent.description,
      availability: heroContent.badge,
      yearsExperience: "4+",
      metrics: featuredMetrics,
      focusAreas: valuePillars.map((pillar) => ({
        title: pillar.title,
        summary: pillar.description,
        highlights: pillar.bullets,
      })),
      experience: experiences.map((item) => ({
        title: item.title,
        organization: item.organization,
        period: item.period,
        summary: item.description,
      })),
      education: {
        title: education.title,
        organization: education.organization,
        summary: education.description,
      },
      skills: skillGroups.map((group) => ({
        category: group.category,
        skills: group.skills,
      })),
      links: contactLinks,
    },
    stats: {
      projectCount: featuredProjects.length,
      noteCount: notes.length,
      notesUrl: "/notes",
      homeUrl: "/",
    },
  };
}

function listProjects() {
  return {
    count: featuredProjects.length,
    projects: featuredProjects.map((project) => ({
      title: project.title,
      group: project.group,
      category: project.category,
      timeline: project.date,
      technologies: project.technologies,
      link: project.link ?? null,
    })),
  };
}

function getProject(name: string) {
  const key = normalize(name);
  const project =
    featuredProjects.find((item) => normalize(item.title).includes(key)) ??
    featuredProjects.find((item) => key.includes(normalize(item.title)));

  if (!project) {
    return {
      found: false,
      message: `No featured project matched "${name}".`,
      available: featuredProjects.map((item) => item.title),
    };
  }

  return {
    found: true,
    title: project.title,
    group: project.group,
    category: project.category,
    timeline: project.date,
    howLong: project.date,
    description: project.description,
    impact: project.impact,
    technologies: project.technologies,
    link: project.link ?? null,
  };
}

async function listNotes() {
  const notes = await getAllNotes();
  return {
    count: notes.length,
    notes: notes.map((note) => ({
      title: note.title,
      slug: note.slug,
      url: `/notes/${note.slug}`,
      tags: note.tags,
      publishedAt: note.displayDate,
    })),
  };
}

async function getNote(query: string) {
  const notes = await getAllNotes();
  const key = normalize(query);

  const bySlug = notes.find((note) => normalize(note.slug) === key);
  const byTitle = notes.find(
    (note) =>
      normalize(note.title).includes(key) || key.includes(normalize(note.title))
  );
  const match = bySlug ?? byTitle;

  if (!match) {
    return {
      found: false,
      message: `No published note matched "${query}".`,
      available: notes.map((note) => ({
        title: note.title,
        slug: note.slug,
        url: `/notes/${note.slug}`,
      })),
    };
  }

  const detail = await getNoteBySlug(match.slug);
  const body = bodyToPlainText(detail?.body).slice(0, 2500);

  return {
    found: true,
    title: match.title,
    slug: match.slug,
    url: `/notes/${match.slug}`,
    tags: match.tags,
    publishedAt: match.displayDate,
    takeaways: detail?.takeaways ?? match.takeaways ?? [],
    excerpt: body,
  };
}

async function searchNotes(query: string) {
  const { geminiApiKey, pineconeApiKey, pineconeIndexName } = requireChatEnv();
  const vector = await embedQuery(geminiApiKey, query);
  const matches = await queryPortfolioChunks({
    apiKey: pineconeApiKey,
    indexName: pineconeIndexName,
    vector,
    topK: CHAT_TOP_K,
  });

  return {
    count: matches.length,
    matches: matches.map((match) => ({
      title: match.title,
      url: match.url,
      score: match.score,
      text: match.text.slice(0, 700),
    })),
  };
}

export async function executePortfolioTool(
  name: string,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "get_portfolio_stats":
      return getPortfolioStats();
    case "list_projects":
      return listProjects();
    case "get_project":
      return getProject(String(args.name ?? ""));
    case "list_notes":
      return listNotes();
    case "get_note":
      return getNote(String(args.query ?? ""));
    case "search_notes":
      return searchNotes(String(args.query ?? ""));
    default:
      return { error: `Unknown tool: ${name}` };
  }
}
