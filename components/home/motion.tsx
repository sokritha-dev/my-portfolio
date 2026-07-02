"use client";

import { domAnimation, LazyMotion, m, useReducedMotion, type Variants } from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

type ClassNameProps = PropsWithChildren<{
  className?: string;
  delay?: number;
}>;

export function PageTransition({ children, className }: ClassNameProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className={className}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function Reveal({ children, className, delay = 0 }: ClassNameProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        variants={revealVariants}
        transition={{ delay }}
        className={className}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function HoverCard({
  children,
  className,
  delay,
}: PropsWithChildren<{
  className?: string;
  delay?: number;
}>) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={prefersReducedMotion ? false : "hidden"}
        whileInView={prefersReducedMotion ? undefined : "visible"}
        viewport={{ once: true, amount: 0.2 }}
        variants={prefersReducedMotion ? undefined : revealVariants}
        transition={prefersReducedMotion ? undefined : { delay }}
        whileHover={
          prefersReducedMotion
            ? undefined
            : { y: -4, scale: 1.01, transition: { duration: 0.2 } }
        }
        className={className}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function MotionAccent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        whileHover={
          prefersReducedMotion
            ? undefined
            : { scale: 1.02, transition: { duration: 0.2 } }
        }
        className={cn(className)}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
