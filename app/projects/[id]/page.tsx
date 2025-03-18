"use client";

import { useRouter } from "next/router";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Calendar } from "lucide-react";
import Link from "next/link";

const projects = [
  {
    id: "web-scraping-automation",
    title: "Web Scraping Automation System",
    category: "Side Project",
    date: "Jan 2025 - Now",
    description:
      "Developed a system to scrape and structure data from any website, integrating FastAPI, Celery, and AI-powered processing.",
    technologies: ["FastAPI", "Celery", "React", "MongoDB", "AWS"],
    deployed: false,
  },
  {
    id: "course-marketplace",
    title: "Course Marketplace",
    category: "Side Project",
    date: "2021",
    description:
      "A blockchain-based platform enabling users to purchase online courses via Metamask on the Robsten Test Network. Deployed smart contracts using Infura and hosted on Vercel.",
    technologies: ["Solidity", "Ganache", "Infura", "Web3", "Next.js", "Tailwind CSS"],
    deployed: true,
    link: "https://course-marketplace-phi.vercel.app/",
  },
];

export default function ProjectDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return <div className="text-center text-muted-foreground">Project not found</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-background px-4 md:px-6 py-12">
      <Card className="max-w-3xl p-8 shadow-lg">
        <h1 className="text-3xl font-bold">{project.title}</h1>
        <div className="flex items-center gap-3 text-muted-foreground mt-2">
          <Calendar className="h-5 w-5" />
          <span>{project.date}</span>
        </div>

        <p className="text-lg text-muted-foreground mt-4">{project.description}</p>

        <div className="mt-6">
          <h3 className="text-lg font-semibold">Technologies Used</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {project.technologies.map((tech, index) => (
              <Badge key={index} variant="outline">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {project.link && (
          <div className="mt-6">
            <Link href={project.link} target="_blank" className="text-primary hover:underline flex items-center">
              Live Demo <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </div>
        )}

        <div className="mt-6">
          <Link href="/" className="text-primary hover:underline">
            Back to Projects
          </Link>
        </div>
      </Card>
    </div>
  );
}
