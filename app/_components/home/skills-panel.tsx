import {
  Cloud,
  Code2,
  Server,
  Users2,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/home/motion";
import type { SkillGroup } from "@/lib/home-content";
import { cn } from "@/lib/utils";

const categoryIcons: Record<string, LucideIcon> = {
  Frontend: Code2,
  Backend: Server,
  "Cloud & Delivery": Cloud,
  Leadership: Users2,
};

type SkillsPanelProps = {
  groups: SkillGroup[];
};

function SkillGroupCell({
  group,
  index,
  total,
}: {
  group: SkillGroup;
  index: number;
  total: number;
}) {
  const Icon = categoryIcons[group.category] ?? Code2;

  return (
    <div
      className={cn(
        "group/cell p-6 transition-colors duration-300 sm:p-8",
        "hover:bg-[hsl(var(--accent-soft)/0.3)]",
        index < total - 1 && "border-b border-border/40 md:border-b-0",
        index < 2 && "md:border-b md:border-border/40",
        index % 2 === 0 && "md:border-r md:border-border/40",
      )}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--accent-soft))] text-[hsl(var(--accent-strong))] transition-transform duration-300 group-hover/cell:scale-105">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </div>
        <h3 className="text-base font-semibold tracking-tight sm:text-lg">
          {group.category}
        </h3>
      </div>

      <ul className="mt-5 grid gap-x-4 gap-y-2.5 sm:grid-cols-2">
        {group.skills.map((skill, skillIndex) => (
          <li
            key={skill}
            className={cn(
              "flex items-start gap-2.5 text-sm leading-snug",
              skillIndex < 2
                ? "font-medium text-foreground/90"
                : "text-muted-foreground",
            )}
          >
            <span
              className={cn(
                "mt-[0.45rem] h-1 w-1 shrink-0 rounded-full",
                skillIndex < 2
                  ? "bg-[hsl(var(--accent-strong))]"
                  : "bg-border",
              )}
            />
            <span>{skill}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SkillsPanel({ groups }: SkillsPanelProps) {
  return (
    <Reveal>
      <div
        className={cn(
          "relative overflow-hidden rounded-[1.75rem]",
          "border border-border/45 bg-[hsl(var(--card)/0.85)] shadow-[var(--shadow-soft)] backdrop-blur-sm",
        )}
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[hsl(var(--hero-glow)/0.09)] to-transparent" />
        <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(var(--accent-strong)/0.25)] to-transparent" />

        <div className="relative grid md:grid-cols-2">
          {groups.map((group, index) => (
            <SkillGroupCell
              key={group.category}
              group={group}
              index={index}
              total={groups.length}
            />
          ))}
        </div>
      </div>
    </Reveal>
  );
}
