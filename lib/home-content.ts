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
  name: "Sokritha Yen",
  title: "Full-stack developer building thoughtful, scalable web products.",
  description:
    "I design and ship modern experiences across frontend, backend, and cloud infrastructure, with a strong focus on product clarity, developer experience, and maintainable systems.",
  primaryCta: {
    label: "Let’s work together",
    href: "mailto:sokritha.yen@gmail.com",
  },
  secondaryCta: {
    label: "View resume",
    href: "/cv.pdf",
  },
};

export const featuredMetrics: FeaturedMetric[] = [
  { value: "4+", label: "Years building web products" },
  { value: "4", label: "Bootcamps coached end-to-end" },
  { value: "AWS", label: "Cloud-first delivery mindset" },
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
      "From polished interfaces to backend workflows and cloud deployment, I ship complete systems instead of isolated screens.",
    bullets: [
      "Next.js, React, TypeScript, Tailwind CSS",
      "FastAPI, Node.js, GraphQL, MongoDB, PostgreSQL",
      "AWS, Docker, CI/CD, serverless infrastructure",
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
    date: "Oct 2025 - Present",
    description:
      "A Japanese gacha platform where I built both the customer-facing site and the admin site. After five months in production, it reached **70K USD in revenue** while covering payments, gacha operations, stock workflows, and admin management.",
    impact:
      "Built independently end-to-end across the full product surface and internal operations tooling.",
    technologies: ["Next.js", "AWS", "Stripe"],
    link: "https://torecaquest.jp",
  },
  {
    title: "FRANCE BED",
    group: "professional",
    category: "Product search and data pipeline",
    date: "End of May 2026 - Present",
    description:
      "In FRANCE BED project, I worked within a team on the product-search side of the system, focusing on embedding product data into vector search and building a free-text search experience.",
    impact:
      "Contributed specifically to the search pipeline and search-related features that improved how users discover and query product data.",
    technologies: ["Laravel", "Vector Search"],
  },
  {
    title: "ThinkNLP",
    group: "personal",
    category: "Educational AI product",
    date: "2025",
    description:
      "An educational app for NLP beginners to explore sentiment analysis and topic modeling with guided workflows and visual feedback.",
    impact:
      "Built an interactive learning experience that turns complex NLP concepts into approachable product flows.",
    technologies: [
      "FastAPI",
      "React",
      "PostgreSQL",
      "Docker",
      "Kubernetes",
      "S3",
    ],
    link: "https://thinknlp.xyz",
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
    title: "E-Learning Management System",
    group: "professional",
    category: "Platform engineering",
    date: "2023 - 2025",
    description:
      "An internal e-learning platform for admins and coaches with modular architecture, video content workflows, and scalable operations.",
    impact:
      "Helped shape a micro frontend system that allowed independent platform modules to evolve with less coupling.",
    technologies: [
      "Next.js",
      "Serverless Framework",
      "Lambda",
      "DynamoDB",
      "GraphQL",
      "Cognito",
    ],
    link: "https://sabaicode.com",
  },
];

export const experiences: TimelineItem[] = [
  {
    title: "Software Engineer",
    organization: "MarinaxPP",
    period: "Oct 2025 - Present",
    description:
      "Working on software solutions for the Japanese market, including building TorecaQuest independently and contributing to FRANCE BED search features, product-data embedding pipelines, and Laravel-based development.",
  },
  {
    title: "Web Development Coach & Full-Stack Developer",
    organization: "SabaiCode School",
    period: "Jun 2022 - Jan 2025",
    description:
      "Built an internal e-learning system with micro frontends, serverless backend, and AWS infrastructure while coaching four six-month web development bootcamps.",
  },
  {
    title: "Full-Stack Developer Intern",
    organization: "Cambodia Securities Exchange",
    period: "2021",
    description:
      "Developed a real-time renewal system that managed investor data and integrated with external systems over TCP and UDP.",
  },
  {
    title: "Frontend Developer Intern",
    organization: "Optistech Co., Ltd.",
    period: "2020",
    description:
      "Designed and implemented a dashboard for ticket management with seamless integration into the existing backend.",
  },
];

export const education = {
  title: "Computer Science",
  organization: "Institute of Technology of Cambodia",
  description:
    "Bachelor's degree focused on software engineering fundamentals, system thinking, and practical development foundations.",
};

export const communityHighlights: TimelineItem[] = [
  {
    title: "Evaluator",
    organization: "Game Changer Coalition",
    period: "Community leadership",
    description:
      "Reviewed student game submissions for a national innovation program supported by MoEYS and UNICEF, with a focus on creativity and impact.",
  },
  {
    title: "Trainer",
    organization: "Institute of Technology of Cambodia",
    period: "Volunteer work",
    description:
      "Taught junior students programming fundamentals and algorithmic thinking through introductory C sessions.",
  },
];

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Micro Frontend",
    ],
  },
  {
    category: "Backend",
    skills: [
      "Node.js",
      "Express",
      "FastAPI",
      "MongoDB",
      "DynamoDB",
      "GraphQL",
      "REST API",
      "Testing",
    ],
  },
  {
    category: "Cloud & Delivery",
    skills: [
      "AWS",
      "Docker",
      "GitHub Actions",
      "CI/CD",
      "Serverless Framework",
      "S3",
      "Route 53",
      "CloudWatch",
    ],
  },
  {
    category: "Leadership",
    skills: [
      "Mentorship",
      "Technical Writing",
      "Cross-team Collaboration",
      "Project Planning",
      "Presentation Skills",
    ],
  },
];

export const availabilityOptions: AvailabilityOption[] = [
  {
    title: "Freelance product build",
    summary: "For founders or teams who need a reliable engineer to ship a polished product slice.",
    details: [
      "Landing pages and product surfaces",
      "API and integration work",
      "Delivery with strong communication",
    ],
    highlight: true,
  },
  {
    title: "Frontend acceleration",
    summary: "For teams that need help improving UI quality, performance, and implementation clarity.",
    details: [
      "Responsive interface architecture",
      "Design-system minded Tailwind workflows",
      "Performance-oriented implementation",
    ],
  },
  {
    title: "Mentoring and technical guidance",
    summary: "For developers or small teams who want hands-on support with code quality and product thinking.",
    details: [
      "Code reviews and pairing",
      "Implementation strategy coaching",
      "Practical guidance, not generic advice",
    ],
  },
];

export const contactLinks = [
  {
    label: "GitHub",
    href: "https://github.com/sokritha-dev",
  },
  {
    label: "Email",
    href: "mailto:sokritha.yen@gmail.com",
  },
  {
    label: "Resume",
    href: "/cv.pdf",
  },
  {
    label: "Notes",
    href: "/notes",
  },
];
