"use client";

import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "framer-motion";
import { useEffect, useState } from "react";

import { welcomeIntro } from "@/lib/home-content";

type IntroPhase = "welcome" | "opening" | "done";

export function WelcomeIntro() {
  const prefersReducedMotion = useReducedMotion();
  const [phase, setPhase] = useState<IntroPhase>("welcome");

  useEffect(() => {
    if (phase === "done") return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [phase]);

  useEffect(() => {
    if (prefersReducedMotion) {
      const doneTimer = window.setTimeout(() => setPhase("done"), 1000);
      return () => window.clearTimeout(doneTimer);
    }

    const openTimer = window.setTimeout(() => setPhase("opening"), 1700);
    const doneTimer = window.setTimeout(() => setPhase("done"), 2900);

    return () => {
      window.clearTimeout(openTimer);
      window.clearTimeout(doneTimer);
    };
  }, [prefersReducedMotion]);

  const doorsOpen = phase === "opening";

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence>
        {phase !== "done" ? (
          <m.div
            key="welcome-intro"
            className="fixed inset-0 z-[100]"
            aria-hidden={doorsOpen}
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            animate={
              prefersReducedMotion
                ? { opacity: phase === "welcome" ? 1 : 0 }
                : { opacity: 1 }
            }
            transition={{ duration: prefersReducedMotion ? 0.6 : 0.2 }}
          >
            <m.div
              className="absolute inset-y-0 left-0 w-1/2 bg-background"
              initial={{ x: 0 }}
              animate={{ x: doorsOpen && !prefersReducedMotion ? "-100%" : 0 }}
              transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
            />
            <m.div
              className="absolute inset-y-0 right-0 w-1/2 bg-background"
              initial={{ x: 0 }}
              animate={{ x: doorsOpen && !prefersReducedMotion ? "100%" : 0 }}
              transition={{ duration: 0.95, ease: [0.76, 0, 0.24, 1] }}
            />

            <div className="relative z-10 flex h-full items-center justify-center px-6">
              <m.div
                className="text-center"
                initial={{ opacity: 0, y: 8 }}
                animate={
                  phase === "welcome"
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: -6 }
                }
                transition={{
                  duration: phase === "welcome" ? 0.55 : 0.3,
                  ease: "easeOut",
                }}
              >
                <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-2">
                  <span
                    lang="km"
                    className="font-khmer text-5xl font-semibold leading-none text-foreground sm:text-6xl md:text-7xl"
                  >
                    {welcomeIntro.greetingKhmer}
                  </span>
                  <span className="font-serif text-4xl font-semibold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                    {welcomeIntro.greeting}
                  </span>
                </p>
                <p className="mt-5 text-base text-muted-foreground sm:text-lg">
                  {welcomeIntro.message}
                </p>
                <p className="mt-3 text-sm font-medium tracking-[0.08em] text-foreground/80">
                  {welcomeIntro.name}
                </p>
              </m.div>
            </div>
          </m.div>
        ) : null}
      </AnimatePresence>
    </LazyMotion>
  );
}
