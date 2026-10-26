/**
 * Canonical technology tags for notes (blogs explaining what you know).
 * Keep Studio options and seed content aligned with this list.
 */
export const NOTE_TECHNOLOGY_TAGS = [
  "AI",
  "Frontend",
  "Backend",
  "Full Stack",
  "Database",
  "DevOps",
  "Cloud",
  "Architecture",
  "Testing",
  "Security",
  "Tooling",
] as const;

export type NoteTechnologyTag = (typeof NOTE_TECHNOLOGY_TAGS)[number];
