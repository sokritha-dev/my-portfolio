import { Type, type FunctionDeclaration } from "@google/genai";

/**
 * Shared tool schemas for the portfolio assistant.
 * Site chat uses these via Gemini function calling; an MCP server can wrap the same handlers later.
 */
export const portfolioToolDeclarations: FunctionDeclaration[] = [
  {
    name: "get_portfolio_stats",
    description:
      "Get the person's basic profile and live portfolio stats: name, role, bio, availability, years of experience, focus areas, work history, education, skills, contact links, featured project count, and published note/blog count. Use this for who-is / about / experience / skills / contact questions.",
  },
  {
    name: "list_projects",
    description:
      "List all featured portfolio projects with title, timeline, category, and tech.",
  },
  {
    name: "get_project",
    description:
      "Get details for one featured project by name (e.g. TorecaQuest, Chakku, FRANCE BED).",
    parameters: {
      type: Type.OBJECT,
      properties: {
        name: {
          type: Type.STRING,
          description: "Project name or close spelling",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "list_notes",
    description:
      "List published notes/blog posts with title, slug, url, tags, and date.",
  },
  {
    name: "get_note",
    description:
      "Get one published note by slug or title, including takeaways and a short body excerpt plus url.",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: "Note slug or title keywords",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "search_notes",
    description:
      "Semantic search over indexed note content for deep technical questions (embeddings, OWASP, IDOR, etc.).",
    parameters: {
      type: Type.OBJECT,
      properties: {
        query: {
          type: Type.STRING,
          description: "Search query",
        },
      },
      required: ["query"],
    },
  },
];
