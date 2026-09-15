# Editorial Homepage Redesign — Implementation Plan

> Executing immediately per user request to implement now.

**Goal:** Pixel-faithful editorial homepage matching `docs/superpowers/specs/2026-09-15-editorial-homepage-redesign-design.md`.

**Architecture:** Keep `lib/home-content.ts`; replace homepage presentation (tokens, fonts, header, sections). Leave `/notes` + `SiteNavigation` for notes routes.

**Tech Stack:** Next.js App Router, Tailwind, `next/font` (Playfair Display + Source Sans 3).
