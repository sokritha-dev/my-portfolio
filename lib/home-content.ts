export type FeaturedMetric = {
  label: string;
  value: string;
};

export type ValuePillar = {
  title: string;
  description: string;
  eyebrow: string;
  bullets: string[];
};

export type Project = {
  title: string;
  group: "professional" | "personal";
  category: string;
  date: string;
  description: string;
  impact: string;
  technologies: string[];
  link?: string;
};

export type TimelineItem = {
  title: string;
  organization: string;
  period: string;
  description: string;
};

export type SkillGroup = {
  category: string;
  skills: string[];
};

export type AvailabilityOption = {
  title: string;
  summary: string;
  details: string[];
  highlight?: boolean;
};

export const heroContent = {
  badge: "Available for selective freelance and product work",
  name: "Yen Sokritha",
  title: "Full-stack web engineer",
  subtitle: "4+ years building and maintaining web applications",
  description:
    "Full-stack developer with 4+ years of experience building and maintaining web applications using TypeScript, Node.js, React, Next.js, databases, and AWS. Experienced in backend development, API integration, database transactions, payment integration, and AI-powered search — from feature implementation and issue investigation through deployment and production support.",
  primaryCta: {
    label: "Let’s work together",
    href: "mailto:sokritha.dev@gmail.com",
  },
  secondaryCta: {
    label: "View resume",
    href: "/cv.pdf",
  },
};

export const processRailSteps = [
  "plan",
  "design",
  "build",
  "deploy",
] as const;

export const welcomeIntro = {
  greeting: "Hello",
  greetingKhmer: "សួស្តី",
  message: "Glad you’re here.",
  name: "Yen Sokritha",
};

export const featuredMetrics: FeaturedMetric[] = [
  { value: "4+", label: "Years building web products" },
  { value: "3", label: "Products shipped — Japan & local" },
  { value: "60", label: "Students mentored across bootcamps" },
];

export const valuePillars: ValuePillar[] = [
  {
    eyebrow: "Product strategy",
    title: "Product-minded execution",
    description:
      "I translate fuzzy ideas into clear interfaces, reliable systems, and deliberate user journeys.",
    bullets: [
      "End-to-end planning from UX to API boundaries",
      "Clean implementation details that scale with the product",
      "Decision-making anchored in maintainability and user value",
    ],
  },
  {
    eyebrow: "Technical depth",
    title: "Full-stack delivery",
    description:
      "From polished interfaces to backend workflows, payments, and cloud deployment, I ship complete systems instead of isolated screens.",
    bullets: [
      "React, Next.js, TypeScript, Tailwind CSS",
      "Node.js, Express, GraphQL, MySQL, MongoDB, DynamoDB",
      "AWS, Docker, CI/CD, payments, AI-powered search",
    ],
  },
  {
    eyebrow: "Team impact",
    title: "Mentoring and team enablement",
    description:
      "I care about how teams build, not just what they build, and I enjoy coaching engineers through practical delivery.",
    bullets: [
      "Bootcamp coaching and curriculum support",
      "Cross-team collaboration and technical communication",
      "Sustainable patterns that reduce future complexity",
    ],
  },
];

export const featuredProjects: Project[] = [
  {
    title: "TorecaQuest",
    group: "professional",
    category: "Ecommerce gacha platform",
    date: "Launched Feb 2026 · Oct 2025 - Present",
    description:
      "Independently developed and maintained the user-facing and admin applications for a Japanese gacha platform using Next.js, TypeScript, Prisma, and MariaDB — supporting ~1,200 registered users and 900K gacha draws. Built core gacha and business-rule systems (probability-based, fixed-allocation, and hybrid draws) plus inventory, coin exchange, rank, delivery, draw history, and admin workflows.",
    impact:
      "Integrated Stripe (cards, Google Pay, Apple Pay, convenience-store payments, bank transfers, refunds) and operated production on AWS EC2, RDS, S3, ALB, and CloudWatch.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Prisma",
      "MariaDB",
      "Stripe",
      "AWS",
    ],
    link: "https://torecaquest.jp",
  },
  {
    title: "FRANCE BED",
    group: "professional",
    category: "AI product search platform",
    date: "Beta · 2026 - Present",
    description:
      "Developed an AI-powered multimodal product search system supporting text and image queries for a catalog of ~150K products, using embeddings and GCP Vector Search. Designed the product embedding pipeline (fields to embed, metadata, filtering/retrieval) and migrated from text-embedding-005 to Gemini Embedding 2.",
    impact:
      "Implemented hybrid SQL + vector search and evaluated retrieval with Recall@K, MRR, NDCG, and Hit Rate. Built Laravel/Blade features including admin management, product pages, and attribute-based related-product recommendations.",
    technologies: [
      "Laravel",
      "Blade",
      "GCP Vector Search",
      "Embeddings",
      "Gemini Embedding 2",
    ],
  },
  {
    title: "Chakku",
    group: "personal",
    category: "Developer utility tool",
    date: "May 2026 - Present",
    description:
      "A local-first toolkit for working with CSV, JSON, Markdown, and hand-drawn whiteboard sketches, with tools to inspect, merge, convert, profile, chart, and export data.",
    impact:
      "Built a practical utility product focused on fast local workflows and better ways to explore and transform structured content.",
    technologies: ["TypeScript", "Data Visualization", "Local-first UX"],
    link: "https://chakku.cloud",
  },
  {
    title: "ThinkNLP",
    group: "personal",
    category: "Educational AI product · Archived",
    date: "2025",
    description:
      "An educational app for NLP beginners to explore sentiment analysis and topic modeling with guided workflows and visual feedback.",
    impact:
      "Built an interactive learning experience that turns complex NLP concepts into approachable product flows. The public site is no longer live.",
    technologies: [
      "FastAPI",
      "React",
      "PostgreSQL",
      "Docker",
      "Kubernetes",
      "S3",
    ],
  },
  {
    title: "E-Learning Management System",
    group: "professional",
    category: "Platform engineering",
    date: "Jun 2022 - Jan 2025",
    description:
      "Developed the E-Learning Platform using Serverless, GraphQL/AppSync, and AWS — contributing to beta and production features including video tutorials, class and lesson management, authentication, staff/admin management, scholarship submission and review workflows, and school landing pages.",
    impact:
      "Shipped platform features across the full lifecycle while mentoring 60 students across four full-stack web development bootcamps.",
    technologies: [
      "Serverless Framework",
      "GraphQL",
      "AppSync",
      "AWS",
      "DynamoDB",
      "Lambda",
    ],
    link: "https://sabaicode.com",
  },
];

export const experiences: TimelineItem[] = [
  {
    title: "Full Stack Web Engineer",
    organization: "Marinax PP (Cambodia) Co., Ltd.",
    period: "Oct 2025 - Present",
    description:
      "Building and operating Japanese-market products: independently shipped TorecaQuest (gacha platform with Stripe payments and AWS production ops) and contributed to the FRANCE BED data platform with multimodal AI search, embedding pipelines, and Laravel features.",
  },
  {
    title: "Coach & Full Stack Developer",
    organization: "SabaiCode",
    period: "Jun 2022 - Jan 2025",
    description:
      "Built the E-Learning Platform with Serverless, GraphQL/AppSync, and AWS. Mentored 60 students across four Full-Stack Web Development Bootcamps covering frontend, backend, databases, Git/GitHub, CI/CD, Docker, and AWS — including curriculum design and guiding 3–4 projects per bootcamp.",
  },
  {
    title: "Web Developer Intern",
    organization: "The Cambodia Securities Exchange",
    period: "2021 · 3 months",
    description:
      "Developed a real-time investor order and information renewal system, integrating with other systems via TCP/UDP using React, WebSocket, Java, Spring Boot, REST, and MySQL.",
  },
  {
    title: "Frontend Developer Intern",
    organization: "Optistech Company",
    period: "2020 · 3 months",
    description:
      "Designed and implemented a new dashboard for managing the ticket system, integrating with the existing backend using Angular and Material UI.",
  },
];

export const education = {
  title: "Bachelor Degree of Computer Science",
  organization: "Institute of Technology of Cambodia",
  description:
    "2016–2021. Also completed the ESL Program at Beltei International School (2017).",
};

export const communityHighlights: TimelineItem[] = [
  {
    title: "Evaluator",
    organization: "Game Changer Coalition",
    period: "End of 2024",
    description:
      "Reviewed student game submissions for a national innovation program supported by MoEYS and UNICEF, with a focus on creativity and impact.",
  },
  {
    title: "Hackathon participant",
    organization: "Spin-Offs · CADT Innovation Center",
    period: "Aug–Sep 2023",
    description:
      "Completed the full Spin-Offs program at the Cambodia Academy of Digital Technology — from orientation and market research through user validation, MVP build and iteration with business and technical mentors, to pitch day.",
  },
  {
    title: "Trainer",
    organization: "Institute of Technology of Cambodia",
    period: "2019 · 3 months",
    description:
      "Delivered comprehensive training on basic algorithms and programming in C to junior students.",
  },
  {
    title: "Environmental Teacher",
    organization: "Global Peace Organization",
    period: "2017 · 3 months",
    description:
      "Educated third-grade students at Kdey Takoy Primary School about environmental subjects.",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    category: "Languages",
    skills: ["JavaScript", "TypeScript"],
  },
  {
    category: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS", "Micro Frontend"],
  },
  {
    category: "Backend",
    skills: [
      "Node.js",
      "Express",
      "GraphQL",
      "MongoDB",
      "MySQL",
      "DynamoDB",
      "Serverless",
    ],
  },
  {
    category: "Cloud & Infrastructure",
    skills: [
      "AWS",
      "EC2",
      "RDS",
      "S3",
      "Lambda",
      "ALB",
      "CloudWatch",
      "Docker",
      "Nginx",
    ],
  },
  {
    category: "DevOps",
    skills: ["Git", "GitHub Actions", "CI/CD"],
  },
  {
    category: "AI & Search",
    skills: [
      "LLM APIs",
      "Embeddings",
      "Multimodal Embeddings",
      "Vector Search",
    ],
  },
  {
    category: "Payments",
    skills: [
      "Stripe",
      "Credit cards",
      "Google Pay",
      "Apple Pay",
      "Convenience-store payments",
      "Bank transfers",
    ],
  },
];

export const availabilityOptions: AvailabilityOption[] = [
  {
    title: "Freelance product build",
    summary:
      "For founders or teams who need a reliable engineer to ship a polished product slice.",
    details: [
      "Landing pages and product surfaces",
      "API and integration work",
      "Delivery with strong communication",
    ],
    highlight: true,
  },
  {
    title: "Frontend acceleration",
    summary:
      "For teams that need help improving UI quality, performance, and implementation clarity.",
    details: [
      "Responsive interface architecture",
      "Design-system minded Tailwind workflows",
      "Performance-oriented implementation",
    ],
  },
  {
    title: "Mentoring and technical guidance",
    summary:
      "For developers or small teams who want hands-on support with code quality and product thinking.",
    details: [
      "Code reviews and pairing",
      "Implementation strategy coaching",
      "Practical guidance, not generic advice",
    ],
  },
];

export const contactLinks = [
  {
    label: "Email",
    href: "mailto:sokritha.dev@gmail.com",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/sokritha-yen",
  },
  {
    label: "Resume",
    href: "/cv.pdf",
  },
];
