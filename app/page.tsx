"use client";

import { motion } from "framer-motion";
import {
  User,
  Briefcase,
  FileText,
  Github,
  ExternalLink,
  Sparkles,
  HeartHandshake,
  Waypoints,
  GraduationCap,
  Code2,
  Globe,
  Cloud,
  Server,
  Lightbulb,
  Speech,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import ThemeToggle from "@/app/_components/theme-toggle";

const technicalSkills = [
  {
    category: "Frontend",
    icon: <Globe className="h-6 w-6 text-primary" />,
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
    icon: <Server className="h-6 w-6 text-primary" />,
    skills: [
      "Node.js",
      "Express",
      "FastAPI",
      "MongoDB",
      "DynamoDB",
      "Unit Test",
      "Integration Test",
      "Restful API",
      "GraphQL",
    ],
  },
  {
    category: "DevOps & Cloud",
    icon: <Cloud className="h-6 w-6 text-primary" />,
    skills: [
      "AWS",
      "Serverless Framework",
      "Docker",
      "GitHub Actions",
      "CI/CD",
      "Lambda Function",
      "S3",
      "Route 53",
      "Cloudwatch",
    ],
  },
];

const softSkills = [
  {
    category: "Leadership & Mentorship",
    icon: <Users className="h-6 w-6 text-primary" />,
    skills: [
      "Coaching & Mentoring",
      "Team Leadership",
      "Project Management",
      "Training & Development",
    ],
  },
  {
    category: "Problem-Solving",
    icon: <Lightbulb className="h-6 w-6 text-primary" />,
    skills: ["Critical Thinking", "Analytical Skills", "Troubleshooting"],
  },
  {
    category: "Communication",
    icon: <Speech className="h-6 w-6 text-primary" />,
    skills: [
      "Technical Writing",
      "Cross-Team Collaboration",
      "Presentation Skills",
    ],
  },
];

const experiences = [
  {
    title: "Web Development Coach & Full-Stack Developer",
    company: "SabaiCode School",
    period: "June 2022 - January 2025",
    description:
      "Developed an internal e-learning system with micro frontends, serverless backend, and AWS infrastructure. Taught four 6-months web development bootcamps covering React, Next.js, Node.js, MongoDB, and AWS.",
  },
  {
    title: "Full-Stack Developer Intern",
    company: "Cambodia Securities Exchange (CSX)",
    period: "2021 - 3 Months",
    description:
      "Built a real-time renewal system to manage orders and personal information from investors, integrating with other systems via TCP & UDP protocols using Sprint Boot, MySQL and React.",
  },
  {
    title: "Frontend Developer Intern",
    company: "Optistech Co., Ltd.",
    period: "2020 - 3 Months",
    description:
      "Designed and implemented a new dashboard for managing the ticket system, ensure seamless integration with the existing backend using Angular and Material UI.",
  },
];

const volunteerExperiences = [
  {
    title: "Trainer",
    organization: "Institute of Technology of Cambodia",
    period: "2019 - 3 Months",
    description:
      "Delivered comprehensive training on basic algorithms and programming in C to junior students.",
  },
  {
    title: "Environmental Teacher",
    organization: "Global Peace Organization",
    period: "2017 - 3 Months",
    description:
      "Educated third-grade students at Kdey Takoy Primary School about environmental subjects.",
  },
];

const projects = [
  {
    id: "thinknlp",
    title: "ThinkNLP – Educational NLP App",
    category: "Side Project",
    date: "April 2025 - Now",
    description:
      "An educational web app for NLP beginners to explore sentiment analysis and topic modeling using real-world review data. Features an interactive pipeline built with FastAPI, Celery, and React, supporting customizable steps and visual insights.",
    technologies: [
      "FastAPI",
      "React",
      "PostgreSQL",
      "Docker",
      "Kubernetes",
      "S3",
      "Better Stack",
    ],
    deployed: true,
    link: "https://thinknlp.xyz", // replace or remove if not deployed publicly
  },
  {
    id: "e-learning-platform",
    title: "E-Learning Management System",
    category: "Company Project",
    date: "2023",
    description:
      "Developed an internal e-learning platform enabling admins and coaches to interact through video streaming, and content management. Implemented a micro frontend architecture to scale different platform modules independently.",
    technologies: [
      "Next.js",
      "Serverless Framework",
      "Lambda Function",
      "DynamoDB",
      "GraphQL",
      "Cognito",
      "Micro Frontend",
    ],
    deployed: true,
  },
  {
    id: "web-scraping-automation",
    title: "Web Scraping Automation System",
    category: "Side Project",
    date: "Jan 2025 - Now",
    description:
      "Developed a system to scrape and structure data from any website, integrating FastAPI, Celery, and AI-powered processing.",
    technologies: ["FastAPI", "Celery", "React", "MongoDB", "AWS", "Redis"],
    deployed: true,
    link: "https://www.prettyscrape.com",
  },
  {
    id: "course-marketplace",
    title: "Course Marketplace",
    category: "Side Project",
    date: "2022",
    description:
      "A blockchain-based platform enabling users to purchase online courses via Metamask on the Robsten Test Network. Deployed smart contracts using Infura and hosted on Vercel.",
    technologies: [
      "Solidity",
      "Ganache",
      "Infura",
      "Web3",
      "Next.js",
      "Tailwind CSS",
    ],
    deployed: true,
    link: "https://course-marketplace-phi.vercel.app/",
  },
  {
    id: "jpedia",
    title: "Jpedia - Online Code Editor",
    category: "Side Project",
    date: "2021",
    description:
      "An open-source online editor allowing users to write JavaScript and React code using Markdown. Features live transpilation using ESBuild and enhanced security against DOM manipulation.",
    technologies: [
      "React",
      "TypeScript",
      "Redux",
      "Monaco Editor",
      "Bulma",
      "Lerna",
    ],
    deployed: true,
    link: "https://www.npmjs.com/package/jpedia",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-4 md:px-6 py-12">
      {/* Hero Section */}
      <section className="w-full text-center py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl md:text-6xl font-bold">Sokritha Yen</h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-2">
            Full-Stack Developer & Mentor
          </p>
        </motion.div>

        {/* Personal Contact */}
        <TooltipProvider>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex space-x-4 mt-6 justify-center"
          >
            {/* GitHub Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="https://github.com/sokritha-dev" target="_blank">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                  >
                    <Github className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>View my GitHub</TooltipContent>
            </Tooltip>

            {/* CV Button */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/cv.pdf" target="_blank">
                  <Button
                    variant="outline"
                    size="icon"
                    className="hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                  >
                    <FileText className="h-5 w-5" />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>View my CV</TooltipContent>
            </Tooltip>
          </motion.div>

          {/* Light/Dark Mode Toggle */}
          <ThemeToggle />
        </TooltipProvider>
      </section>

      {/* Main Content */}
      <main className="w-full max-w-4xl">
        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:w-[500px] mx-auto">
            <TabsTrigger value="about">About</TabsTrigger>
            <TabsTrigger value="experience">Experience</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          {/* About Me Section */}

          <TabsContent value="about" className="space-y-6">
            <Card className="p-8 shadow-lg flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <User className="h-5 w-5" />
                <h2 className="text-2xl font-bold">About Me</h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed">
                I am a full-stack developer specializing in frontend, backend,
                and cloud infrastructure. Passionate about building scalable,
                high-performance applications, I have hands-on experience with
                React, Next.js, Node.js, AWS, and DevOps.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                In addition to development, I have a strong background in
                technical mentorship, training and guiding aspiring developers
                through multiple web development bootcamps.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Currently, I am developing ThinkNLP — an educational web app
                that helps beginners understand sentiment and topic analysis
                using real-world review data. Built with FastAPI, Celery, and
                AI-driven processing, it allows users to interactively explore
                NLP pipelines and visualize insights.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                I'm also building a web scraping automation system, leveraging
                FastAPI and Celery to push the boundaries of automation and
                structured data extraction.
              </p>
            </Card>

            <Card className="p-8 shadow-lg flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <GraduationCap className="h-5 w-5" />
                <h2 className="text-2xl font-bold">Education</h2>
              </div>
              <p className="text-muted-foreground mt-4 text-lg leading-relaxed">
                Bachelor's degree in Computer Science from Institute of
                Technology of Cambodia, where I gained a solid foundation in
                software engineering principles and practices.
              </p>
            </Card>

            <Card className="p-8 shadow-lg flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Sparkles className="h-5 w-5" />
                <h2 className="text-2xl font-bold">
                  Competitions & Hackathons
                </h2>
              </div>
              <div className="space-y-8 mt-4">
                <div className="relative pl-6 pb-6 border-l-2 border-primary/20">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2" />
                  <h3 className="font-semibold text-lg">
                    Spin Off Hackathon Program
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Supported by Institute of Digital Research & Innovation
                  </p>
                  <p className="mt-2">
                    Participated in a hackathon focused on business startups,
                    where I learned about entrepreneurial strategies, developed
                    a business plan, and pitched an innovative idea. Although we
                    didn't win, the experience was invaluable in understanding
                    the startup ecosystem.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-lg flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Waypoints className="h-5 w-5" />
                <h2 className="text-2xl font-bold">Community Involvement</h2>
              </div>
              <div className="space-y-8 mt-4">
                <div className="relative pl-6 pb-6 border-l-2 border-primary/20">
                  <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2" />
                  <h3 className="font-semibold text-lg">
                    Evaluator - Game Changer Coalition
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Supported by Ministry of Education, Youth and Sport (MoEYS)
                    & UNICEF
                  </p>
                  <p className="mt-2">
                    Served as an evaluator for a national program aimed at
                    encouraging secondary school students from public schools to
                    create innovative games that address public issues.
                    Contributed to reviewing game submissions, providing
                    feedback, and ensuring alignment with the program’s goals of
                    fostering creativity and problem-solving skills among young
                    participants.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-8 shadow-lg flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <HeartHandshake className="h-5 w-5" />
                <h2 className="text-2xl font-bold">Volunteer Activities</h2>
              </div>
              <div className="space-y-8 mt-4">
                {volunteerExperiences.map((exp, index) => (
                  <div
                    key={index}
                    className="relative pl-6 pb-6 border-l-2 border-primary/20 last:pb-0"
                  >
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2" />
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exp.organization} • {exp.period}
                    </p>
                    <p className="mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Work Experience Section */}

          <TabsContent value="experience" className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Briefcase className="h-5 w-5" />
                <h2 className="text-2xl font-bold">Work Experience</h2>
              </div>
              <div className="space-y-8">
                {experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="relative pl-6 pb-6 border-l-2 border-primary/20 last:pb-0"
                  >
                    <div className="absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-2" />
                    <h3 className="font-semibold text-lg">{exp.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {exp.company} • {exp.period}
                    </p>
                    <p className="mt-2">{exp.description}</p>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="projects" className="space-y-6">
            <h2 className="text-2xl font-bold">Company Project</h2>
            <hr className="border-t border-gray-300 mb-4" />
            {projects
              .filter((p) => p.category === "Company Project")
              .map((project, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.date}
                  </p>
                  <p className="mt-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </Card>
              ))}

            <h2 className="text-2xl font-bold mt-8">Side Projects</h2>
            <hr className="border-t border-gray-300 mb-4" />
            {projects
              .filter((p) => p.category === "Side Project")
              .map((project, index) => (
                <Card key={index} className="p-6">
                  <h3 className="text-xl font-semibold">{project.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {project.date}
                  </p>
                  <p className="mt-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {project.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                  {project.link && (
                    <div className="mt-4">
                      <Link
                        href={project.link}
                        target="_blank"
                        className="text-primary hover:underline flex items-center"
                      >
                        View Project <ExternalLink className="h-4 w-4 ml-2" />
                      </Link>
                    </div>
                  )}
                </Card>
              ))}
          </TabsContent>

          {/* Skills Section */}
          <TabsContent value="skills" className="space-y-6">
            <Card className="p-8 shadow-lg">
              <div className="flex items-center gap-4">
                <Code2 className="h-10 w-10 text-primary" />
                <h2 className="text-2xl font-bold">Technical & Soft Skills</h2>
              </div>

              {/* Technical Skills */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-3">Technical Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {technicalSkills.map((tech, index) => (
                    <div
                      key={index}
                      className="bg-muted p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {tech.icon}
                        <h4 className="text-lg font-semibold">
                          {tech.category}
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tech.skills.map((skill, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-300"
                          >
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Soft Skills */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Soft Skills</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {softSkills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-muted p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        {skill.icon}
                        <h4 className="text-lg font-semibold">
                          {skill.category}
                        </h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {skill.skills.map((s, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="hover:bg-primary hover:text-white transition"
                          >
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
