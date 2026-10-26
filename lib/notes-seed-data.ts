/**
 * Starter note content used by `npm run sanity:seed`.
 * Published notes are managed in Sanity Studio after seeding.
 */

export type SeedBodyBlock =
  | { _type: "noteHeading"; heading: string }
  | { _type: "noteParagraph"; text: string }
  | { _type: "noteBullets"; items: string[] }
  | {
      _type: "noteCode";
      code: string;
      language?: string;
      filename?: string;
    };

export type SeedSeries = {
  title: string;
  slug: string;
  part: number;
};

export type SeedNote = {
  slug: string;
  title: string;
  publishedAt: string;
  tags: string[];
  series?: SeedSeries;
  takeaways: string[];
  body: SeedBodyBlock[];
};

export const seedNotes: SeedNote[] = [
  {
    slug: "shipping-a-product-alone",
    title: "Shipping a product alone changes how you make decisions",
    publishedAt: "2026-06-14",
    tags: ["Full Stack", "Architecture"],
    takeaways: [
      "What: Solo shipping forces tradeoffs between speed and maintainability",
      "How: Prefer thin vertical slices over isolated layers",
      "When: Document decisions while the context is still fresh",
      "How: Protect one weekly block for refactor debt",
    ],
    body: [
      {
        _type: "noteHeading",
        heading: "Why this matters",
      },
      {
        _type: "noteParagraph",
        text: "When you are the only engineer on a product, every decision carries more weight. A shortcut in one area usually becomes a future responsibility for the same person.",
      },
      {
        _type: "noteParagraph",
        text: "That changes how I think about architecture, release pace, and operational safety. Fast delivery still matters, but clarity matters just as much.",
      },
      {
        _type: "noteHeading",
        heading: "What I optimize for",
      },
      {
        _type: "noteParagraph",
        text: "I try to keep systems easy to reason about before I try to make them clever. That usually means boring architecture, predictable naming, and strong visibility into business-critical flows.",
      },
      {
        _type: "noteBullets",
        items: [
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
    publishedAt: "2026-06-28",
    tags: ["Backend", "Database", "AI"],
    series: {
      title: "Product search",
      slug: "product-search",
      part: 1,
    },
    takeaways: [
      "What: Search quality starts in the data model, not the search box",
      "How: Normalize product data before polishing UI",
      "Why: Inconsistent source data caps the experience",
    ],
    body: [
      {
        _type: "noteHeading",
        heading: "The common mistake",
      },
      {
        _type: "noteParagraph",
        text: "It is easy to think of search as a frontend problem: input box, filters, and results. In practice, the harder part is making sure the product data is structured in a way that search can use well.",
      },
      {
        _type: "noteParagraph",
        text: "If the source data is inconsistent, the search experience will always feel weaker than it should.",
      },
    ],
  },
  {
    slug: "search-what-i-pay-attention-to",
    title: "What I pay attention to when shaping search data",
    publishedAt: "2026-06-30",
    tags: ["Backend", "Database", "AI"],
    series: {
      title: "Product search",
      slug: "product-search",
      part: 2,
    },
    takeaways: [
      "What: Map search intent to stored attributes",
      "How: Pair free-text with structured retrieval",
      "When: Shape data before polishing filters",
    ],
    body: [
      {
        _type: "noteHeading",
        heading: "What I pay attention to",
      },
      {
        _type: "noteParagraph",
        text: "When working on search features, I look closely at how data is embedded, normalized, and shaped before it reaches the user-facing layer.",
      },
      {
        _type: "noteBullets",
        items: [
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
    publishedAt: "2026-07-01",
    tags: ["Frontend", "Tooling", "Full Stack"],
    takeaways: [
      "What: Small tools still need clear information flow",
      "How: Reduce friction between intent and result",
      "Why: Useful outputs matter as much as clever inputs",
    ],
    body: [
      {
        _type: "noteHeading",
        heading: "A small scope does not mean a small product problem",
      },
      {
        _type: "noteParagraph",
        text: "Utility projects often look simple from the outside, but the real value comes from how quickly they help someone complete a task.",
      },
      {
        _type: "noteParagraph",
        text: "That is why I still think about information flow, friction, export paths, and local-first behavior even in smaller tools.",
      },
      {
        _type: "noteHeading",
        heading: "What I want from this kind of project",
      },
      {
        _type: "noteParagraph",
        text: "For small tools, success usually means reducing effort and making the interface feel obvious. If the tool helps someone move from raw data to a useful result faster, it is doing its job.",
      },
      {
        _type: "noteBullets",
        items: [
          "Fast input and transformation flows",
          "Useful output formats",
          "Minimal friction between intent and result",
        ],
      },
    ],
  },
];
