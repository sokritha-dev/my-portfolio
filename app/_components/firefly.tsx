"use client";

import {
  AnimatePresence,
  domAnimation,
  LazyMotion,
  m,
  useReducedMotion,
} from "framer-motion";
import { useCallback, useEffect, useState } from "react";

const TAP_MESSAGES = ["Hey!", "Careful…"] as const;
const DEATH_MESSAGE = "…";
const REVIVE_MESSAGE = "Back again!";
const FLIGHT_STEPS = [
  "Fireflies are nearly extinct",
  "Please don’t hurt me…",
  "Wheee~ lalala ♪",
] as const;
const FLIGHT_STEP_MS = 4800;
const TAPS_TO_DARK = 3;

const bubbleClassName =
  "pointer-events-none absolute left-1/2 z-20 w-max max-w-[14rem] -translate-x-1/2 rounded-full border border-[hsl(var(--hairline))] bg-card px-2.5 py-1 text-center text-[11px] font-medium leading-snug text-foreground shadow-sm sm:max-w-[16rem]";

function FireflySvg({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 271 271"
      fill="currentColor"
      aria-hidden
      className={className}
    >
      <g transform="translate(0 252) scale(0.1 -0.1)">
        <path d="M1768 2329 c-15 -6 -32 -23 -39 -38 -8 -18 -26 -33 -48 -41 -54 -20 -152 -120 -185 -189 l-29 -59 -98 0 -98 -1 -31 56 c-36 64 -115 144 -166 168 -20 9 -38 24 -41 33 -3 9 -17 29 -31 45 -38 41 -93 38 -138 -7 -37 -37 -43 -70 -20 -115 28 -54 92 -65 150 -26 20 14 42 25 47 25 19 0 128 -112 153 -155 l23 -42 -54 -23 c-59 -24 -142 -99 -170 -153 -26 -52 -43 -127 -43 -198 l0 -66 -87 -6 c-138 -10 -229 -32 -373 -89 -131 -52 -228 -136 -277 -238 -22 -45 -27 -69 -27 -135 -1 -67 3 -87 24 -125 55 -99 184 -143 339 -115 94 17 97 18 197 67 92 45 207 134 272 211 24 29 47 56 52 60 4 5 -1 -31 -11 -80 -10 -48 -19 -107 -19 -129 0 -26 -6 -47 -17 -55 -9 -8 -31 -45 -49 -82 -122 -255 35 -580 308 -638 29 -7 86 -9 128 -6 100 7 174 40 251 114 165 157 193 417 65 592 -22 30 -36 60 -36 78 0 16 -5 56 -10 89 -6 32 -12 72 -15 87 -4 26 -2 24 33 -20 52 -64 110 -115 192 -169 130 -84 229 -117 355 -118 132 -1 201 32 258 124 18 29 22 49 22 125 -1 82 -4 96 -34 155 -59 115 -139 179 -307 244 -94 36 -276 76 -348 76 l-43 0 -5 83 c-8 145 -74 250 -201 313 l-68 35 27 47 c32 57 98 128 138 149 27 14 30 14 45 -5 25 -31 79 -55 110 -47 43 11 81 54 81 92 0 88 -67 133 -152 102z" />
      </g>
    </svg>
  );
}

export function Firefly() {
  const prefersReducedMotion = useReducedMotion();
  const [taps, setTaps] = useState(0);
  const [message, setMessage] = useState<string | null>(null);
  const [dead, setDead] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [wanderKey, setWanderKey] = useState(0);
  const [showFlightMessage, setShowFlightMessage] = useState(true);
  const [flightStep, setFlightStep] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!showFlightMessage || dead || message) return;
    if (flightStep >= FLIGHT_STEPS.length - 1) return;

    const timer = window.setTimeout(() => {
      setFlightStep((step) => Math.min(step + 1, FLIGHT_STEPS.length - 1));
    }, FLIGHT_STEP_MS);

    return () => window.clearTimeout(timer);
  }, [showFlightMessage, dead, message, flightStep]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 1700);
    return () => window.clearTimeout(timer);
  }, [message, taps]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dead);
    document.documentElement.style.colorScheme = dead ? "dark" : "light";
    return () => {
      document.documentElement.classList.remove("dark");
      document.documentElement.style.colorScheme = "light";
    };
  }, [dead]);

  const handleTap = useCallback(() => {
    if (dead) {
      // Light mode restored — extinct caption may return.
      setDead(false);
      setTaps(0);
      setFlightStep(0);
      setShowFlightMessage(true);
      setMessage(REVIVE_MESSAGE);
      setWanderKey((key) => key + 1);
      return;
    }

    // Hide flight captions for the rest of this light session.
    setShowFlightMessage(false);

    const next = taps + 1;
    setTaps(next);

    if (next >= TAPS_TO_DARK) {
      setMessage(DEATH_MESSAGE);
      setDead(true);
      return;
    }

    setMessage(TAP_MESSAGES[next - 1] ?? "…");
  }, [dead, taps]);

  if (!mounted) return null;

  const wanderTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 18,
        repeat: Infinity,
        repeatType: "mirror" as const,
        ease: "easeInOut" as const,
      };

  const caption =
    message ??
    (showFlightMessage && !dead ? FLIGHT_STEPS[flightStep] : null);

  return (
    <LazyMotion features={domAnimation}>
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 h-56 overflow-visible sm:h-64">
        <m.div
          key={wanderKey}
          className="pointer-events-auto absolute bottom-5"
          style={{ left: "50%", marginLeft: "-1.75rem" }}
          initial={prefersReducedMotion ? false : { x: 0, y: 0 }}
          animate={
            dead
              ? { x: 0, y: 36, opacity: 0.35, rotate: 22 }
              : prefersReducedMotion
                ? { x: 0, y: 0 }
                : {
                    x: [0, -120, 140, -180, 100, -60, 160, -140, 0],
                    y: [0, -28, -12, -48, -20, -36, -8, -40, 0],
                    rotate: [-6, 8, -4, 10, -7, 5, -3, 9, -6],
                  }
          }
          transition={
            dead ? { duration: 0.85, ease: "easeOut" } : wanderTransition
          }
        >
          <button
            type="button"
            onClick={handleTap}
            aria-label={
              dead
                ? "Revive the firefly and restore light mode"
                : `Firefly, tapped ${taps} of ${TAPS_TO_DARK} times`
            }
            className="relative flex h-14 w-14 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--firefly))]"
          >
            <AnimatePresence mode="popLayout">
              {caption ? (
                <m.span
                  key={caption}
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -6, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={`${bubbleClassName} -top-12 sm:-top-10`}
                >
                  {caption}
                </m.span>
              ) : null}
            </AnimatePresence>

            <span
              className={
                dead
                  ? "absolute inset-2 rounded-full bg-[hsl(var(--firefly)/0.08)]"
                  : "absolute inset-1 animate-pulse rounded-full bg-[hsl(var(--firefly)/0.32)] blur-md"
              }
              aria-hidden
            />
            <FireflySvg
              className={
                dead
                  ? "relative h-10 w-10 text-muted-foreground grayscale"
                  : "relative h-10 w-10 text-[hsl(var(--firefly))] drop-shadow-[0_0_12px_hsl(var(--firefly)/0.75)]"
              }
            />
          </button>
        </m.div>
      </div>
    </LazyMotion>
  );
}
