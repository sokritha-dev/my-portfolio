# Notes Editorial Reading — Implementation Plan

> **For agentic workers:** Execute task-by-task. Steps use checkbox (`- [ ]`) syntax.  
> Executing inline per user request to implement now.

**Goal:** Redesign `/notes` and `/notes/[slug]` into an editorial reading experience with featured lead, takeaways, reading time, TOC rail, and inline images.

**Architecture:** Extend Sanity note schema with `featured`, `takeaways`, and typed `body` blocks (heading / paragraph / bullets / image). Compute reading time and featured selection in `lib/sanity/notes.ts`. Replace card UI with editorial components under `app/_components/notes/`.

**Tech Stack:** Next.js App Router, Tailwind, Sanity v4, `@sanity/image-url`, `next/image`, existing Fraunces + IBM Plex Sans fonts.

## Global Constraints

- Match homepage editorial tokens (paper, gold eyebrows, hairlines); no card/glow Notes UI
- Standalone routes only; no `/blog`
- Inline figures in reading column with captions
- Featured = flagged else newest; featured omitted from index list
- Takeaways max 3; reading time derived, not stored
- Prefer typed body objects over full Portable Text dependency

## File map

| File | Role |
| --- | --- |
| `sanity/schemaTypes/note.ts` | Schema: featured, takeaways, body blocks |
| `lib/sanity/types.ts` | Note types for list/detail/body |
| `lib/sanity/queries.ts` | GROQ for new fields + image assets |
| `lib/sanity/image.ts` | `urlFor` helper |
| `lib/sanity/notes.ts` | Fetch, reading time, featured split, TOC headings |
| `lib/notes-seed-data.ts` + `scripts/seed-notes.ts` | Seed body + takeaways + featured |
| `app/_components/notes/*` | Editorial UI components |
| `app/notes/page.tsx`, `app/notes/[slug]/page.tsx` | Pages |
| Remove/retire | `note-card.tsx` card grid; old `note-sections.tsx` or rewrite |

---

### Task 1: Schema, types, queries, data helpers

**Files:**
- Modify: `sanity/schemaTypes/note.ts`
- Modify: `lib/sanity/types.ts`
- Modify: `lib/sanity/queries.ts`
- Create: `lib/sanity/image.ts`
- Modify: `lib/sanity/notes.ts`

- [x] Replace `sections` with `featured`, `takeaways` (max 3), `body` array of `noteHeading` | `noteParagraph` | `noteBullets` | `noteImage`
- [x] Update types and GROQ; add `urlFor` via `@sanity/image-url`
- [x] Add `estimateReadingTimeMinutes(text: string): number`, `resolveFeaturedNotes(notes)`, `extractTocHeadings(body)`
- [x] Verify TypeScript compiles for these modules

### Task 2: Seed data

**Files:**
- Modify: `lib/notes-seed-data.ts`
- Modify: `scripts/seed-notes.ts`

- [x] Convert seed notes to `body` + `takeaways`; mark one `featured: true`
- [x] Update seed script field mapping

### Task 3: Notes UI components + pages

**Files:**
- Create/rewrite: `app/_components/notes/notes-header.tsx`, `featured-note.tsx`, `notes-index-list.tsx`, `note-meta.tsx`, `note-takeaways.tsx`, `note-body.tsx`, `note-toc.tsx`, `notes-empty-states` (or restyle setup notice)
- Modify: `app/notes/page.tsx`, `app/notes/[slug]/page.tsx`
- Remove usage of: `note-card.tsx` (delete if unused)

- [x] Editorial header (name + About / Notes)
- [x] Index: intro, featured, list rows
- [x] Detail: meta, takeaways, body+images, TOC rail, back link
- [x] Restyle empty/setup notices

### Task 4: Verify

- [x] `npx tsc --noEmit` / `npm run build` (passed)

---

## Spec coverage

- Index featured + list ✓ Task 3  
- Detail reading time + takeaways + TOC + inline images ✓ Tasks 1–3  
- Sanity model ✓ Task 1–2  
- No card grid ✓ Task 3  
- Migration via seed ✓ Task 2  
