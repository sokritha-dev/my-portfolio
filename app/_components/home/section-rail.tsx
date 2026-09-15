"use client";

import type { PropsWithChildren, ReactNode } from "react";

import { Reveal } from "@/components/home/motion";
import { cn } from "@/lib/utils";

type SectionRailProps = PropsWithChildren<{
  id?: string;
  label: ReactNode;
  className?: string;
  contentClassName?: string;
}>;

export function SectionRail({
  id,
  label,
  children,
  className,
  contentClassName,
}: SectionRailProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-20 border-t border-[hsl(var(--hairline))] py-10 sm:scroll-mt-24 sm:py-14 lg:py-16",
        className
      )}
    >
      <div className="mx-auto grid max-w-5xl gap-4 px-4 sm:gap-6 sm:px-8 lg:grid-cols-[9rem_minmax(0,1fr)] lg:gap-12 lg:px-10">
        <Reveal className="pt-0.5 lg:pt-1">
          <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
        </Reveal>
        <div className={cn("min-w-0", contentClassName)}>{children}</div>
      </div>
    </section>
  );
}
