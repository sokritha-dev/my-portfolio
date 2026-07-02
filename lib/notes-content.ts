export type NoteSection = {
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type Note = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  displayDate: string;
  tags: string[];
  sections: NoteSection[];
};

export const notes: Note[] = [
  {
    slug: "shipping-a-product-alone",
    title: "Shipping a product alone changes how you make decisions",
    summary:
      "A short note on balancing speed, ownership, and maintainability when one engineer is responsible for the full product surface.",
    publishedAt: "2026-06-14",
    displayDate: "Jun 14, 2026",
    tags: ["Product", "Execution", "Solo Building"],
    sections: [
      {
        heading: "Why this matters",
        paragraphs: [
          "When you are the only engineer on a product, every decision carries more weight. A shortcut in one area usually becomes a future responsibility for the same person.",
          "That changes how I think about architecture, release pace, and operational safety. Fast delivery still matters, but clarity matters just as much.",
        ],
      },
      {
        heading: "What I optimize for",
        paragraphs: [
          "I try to keep systems easy to reason about before I try to make them clever. That usually means boring architecture, predictable naming, and strong visibility into business-critical flows.",
        ],
        bullets: [
          "Clear admin workflows for day-to-day operations",
          "Reliable payment and stock handling",
          "A product structure that I can continue evolving without fear",
        ],
      },
    ],
  },
  {
    slug: "search-features-start-with-data-shape",
    title: "Search features start with data shape, not just UI",
    summary:
      "A practical note on why product search quality depends on how product data is prepared before the search experience is built.",
    publishedAt: "2026-06-28",
    displayDate: "Jun 28, 2026",
    tags: ["Search", "Data", "Laravel"],
    sections: [
      {
        heading: "The common mistake",
        paragraphs: [
          "It is easy to think of search as a frontend problem: input box, filters, and results. In practice, the harder part is making sure the product data is structured in a way that search can use well.",
          "If the source data is inconsistent, the search experience will always feel weaker than it should.",
        ],
      },
      {
        heading: "What I pay attention to",
        paragraphs: [
          "When working on search features, I look closely at how data is embedded, normalized, and shaped before it reaches the user-facing layer.",
        ],
        bullets: [
          "How product attributes are represented",
          "How search intent maps to the stored data",
          "How free-text search complements more structured retrieval",
        ],
      },
    ],
  },
  {
    slug: "small-tools-are-still-products",
    title: "Small tools are still products",
    summary:
      "Why utility apps deserve the same product thinking as larger platforms, especially when they are built for repeated personal or team workflows.",
    publishedAt: "2026-07-01",
    displayDate: "Jul 1, 2026",
    tags: ["Tools", "UX", "Personal Projects"],
    sections: [
      {
        heading: "A small scope does not mean a small product problem",
        paragraphs: [
          "Utility projects often look simple from the outside, but the real value comes from how quickly they help someone complete a task.",
          "That is why I still think about information flow, friction, export paths, and local-first behavior even in smaller tools.",
        ],
      },
      {
        heading: "What I want from this kind of project",
        paragraphs: [
          "For small tools, success usually means reducing effort and making the interface feel obvious. If the tool helps someone move from raw data to a useful result faster, it is doing its job.",
        ],
        bullets: [
          "Fast input and transformation flows",
          "Useful output formats",
          "Minimal friction between intent and result",
        ],
      },
    ],
  },
];

export function getAllNotes() {
  return [...notes].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getNoteBySlug(slug: string) {
  return notes.find((note) => note.slug === slug);
}
