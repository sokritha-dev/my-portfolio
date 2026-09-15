"use client";

import {
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import type { PropsWithChildren, ReactNode } from "react";

import { cn } from "@/lib/utils";

const easeEditorial = [0.22, 1, 0.36, 1] as const;

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: easeEditorial,
    },
  },
};

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: easeEditorial,
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
        viewport={{ once: true, amount: 0.18, margin: "0px 0px -40px 0px" }}
        variants={revealVariants}
        transition={{ delay }}
        className={className}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function FadeIn({
  children,
  className,
  delay = 0,
}: ClassNameProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay, ease: easeEditorial }}
        className={className}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function Stagger({
  children,
  className,
  delay = 0,
}: ClassNameProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.15, margin: "0px 0px -40px 0px" }}
        variants={staggerContainerVariants}
        transition={{ delay }}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}

export function StaggerItem({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <LazyMotion features={domAnimation}>
      <m.div className={className} variants={staggerItemVariants}>
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
            : { y: -3, transition: { duration: 0.2 } }
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
            : { y: -1, transition: { duration: 0.2 } }
        }
        className={cn(className)}
      >
        {children}
      </m.div>
    </LazyMotion>
  );
}
