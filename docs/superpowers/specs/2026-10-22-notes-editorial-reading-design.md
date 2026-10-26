# Notes Editorial Reading Experience

**Date:** 2026-10-22  
**Status:** Approved for planning  
**Scope:** Standalone `/notes` index and `/notes/[slug]` detail redesign; Sanity schema updates for featured, takeaways, and image-capable body

## Goal

Bring Technical Notes into the portfolio’s editorial visual system while optimizing for short, scannable technical writing with many inline images. Notes remain their own pages (not homepage sections). Readers should understand a note quickly via reading time and key takeaways, then move through clear sections and figures.

## Decisions

| Decision | Choice |
| --- | --- |
| Visual relationship to homepage | Same brand system; richer reading layout (narrow measure, clearer hierarchy) |
| Content length | Short technical notes (~5–10 min) |
| Index pattern | Featured lead + compact chronological index below |
| Featured selection | Manual `featured` flag when set; otherwise newest |
| Detail guidance | Reading time (computed) + Key takeaways (≤3) |
| Detail chrome | Body + “On this page” rail from headings (stacks on mobile) |
| Images | Inline figures inside the reading column with captions |
| Body content model | Portable blocks (heading, paragraph, bullets, image+caption) |
| Routes | Single writing area: `/notes` + `/notes/[slug]` (no separate `/blog`) |
| Approach | Editorial reading shell (no card grid / glow marketing UI) |

## Visual system

### Color & type

- Reuse homepage tokens: warm paper background, charcoal ink, muted gold eyebrows (`--label-gold`), hairline dividers
- Serif (Playfair Display): page titles, note titles, featured title
- Sans (Source Sans 3): nav, meta, body, takeaways, captions, CTAs
- No card surfaces, soft glows, multi-layer shadows, or rounded marketing panels on Notes

### Layout primitives

- Shared site header treatment aligned with portfolio brand (name → home; clear path back to Notes / About)
- Index: max-width container consistent with home; featured block separated by hairlines; index as full-width rows (title · date · reading time)
- Detail: primary reading column (~prose width) + optional right rail for “On this page” from `h2`-level headings; on small screens, rail becomes a compact list above or below the title block—not a persistent desktop-only dependency for reading
- Images: constrained to the reading column width; caption under each figure in muted sans

### Motion

- Subtle enter fades only; respect `prefers-reduced-motion`
- No decorative parallax or glow hover theater

## Information architecture

```
/                    Portfolio (unchanged in this pass; optional clearer Notes link if missing)
/notes               Notes index — intro, featured, index list
/notes/[slug]        Note detail — meta, takeaways, body + images, TOC rail
```

## Screen specs

### `/notes` — Index

1. Header with site name and navigation (About / Notes or equivalent)
2. Eyebrow: “Technical Notes”
3. Serif title + one short supporting sentence (purpose of the writing)
4. **Featured** block (hairline-separated):
   - Label: Featured · {reading time}
   - Serif title, summary, text link “Read note”
5. **Index** of remaining notes only (the featured note is omitted from the list to avoid duplication):
   - Each row: title (serif or strong sans) · date · reading time
   - Entire row clickable to detail
6. Empty / setup states restyled to editorial language (no dashed card panels); keep current Sanity setup messaging for local dev

### `/notes/[slug]` — Detail

1. Header + way back to `/notes`
2. Meta line: published date · reading time · tags (plain text or restrained separators—not pill clusters)
3. Serif title; summary as dek
4. **Key takeaways** block (hairline top/bottom): gold eyebrow, ≤3 bullets from Sanity
5. **Body**: portable content — headings, paragraphs, lists, inline images with captions
6. **On this page**: links to section headings derived from body headings; hide or collapse when fewer than two headings
7. Footer action: text/outline control back to Notes

## Data model (Sanity)

### Keep

- `title`, `slug`, `summary`, `publishedAt`, `tags`

### Add / change

| Field | Type | Notes |
| --- | --- | --- |
| `featured` | boolean | Optional; at most one intended as spotlight (UI may still pick first flagged by newest if multiple) |
| `takeaways` | `string[]` | Max 3; shown near top of detail |
| `body` | portable text / block content | Replaces rigid `sections[]` as the authoring surface: block styles for headings; lists; image blocks with `alt` + `caption` |

### Derived (not stored)

- `readingTime` — compute from body text word count at fetch/render (e.g. ~200 wpm), display as “N min read”
- TOC headings — extract from body heading blocks for the rail

### Migration

- Map existing seed/`sections` content into `body` blocks (heading + paragraphs + bullets) via seed script update and one-time migration notes for any published Studio docs
- Images are new; no backfill required

## Components (presentation)

| Unit | Responsibility |
| --- | --- |
| Notes shell / header | Shared chrome for index + detail |
| `NotesIndexIntro` | Eyebrow, title, description |
| `FeaturedNote` | Lead story from featured-or-newest |
| `NotesIndexList` | Compact rows for remaining notes |
| `NoteMeta` | Date, reading time, tags |
| `NoteTakeaways` | ≤3 bullets |
| `NoteBody` | Render portable body including figures |
| `NoteToc` | “On this page” from headings |
| Empty / Sanity notices | Editorial restyle of existing setup/empty UX |

Prefer rewriting `note-card` usage away rather than preserving the card grid.

## Technical plan (high level)

### Keep

- App Router routes `app/notes/page.tsx`, `app/notes/[slug]/page.tsx`
- Sanity client, queries module, `isSanityConfigured` guards
- Homepage editorial tokens/fonts already in `globals.css` / `layout.tsx`

### Change

- `sanity/schemaTypes/note.ts` — featured, takeaways, body; retire or stop authoring via old `sections`
- `lib/sanity/types.ts`, `queries.ts`, `notes.ts` — types, GROQ, reading-time helper, featured resolution
- Notes UI components under `app/_components/notes/` — editorial layouts; image rendering via Sanity image URLs + `next/image` where appropriate
- Seed script / seed data updated for new shape
- Remove card/glow styling from Notes surfaces

### Error / empty handling

- Dev: Sanity not configured → setup notice (editorial)
- Dev: configured, zero notes → publish/seed guidance
- Prod: zero notes → calm “coming soon”
- Missing slug → `notFound()`

## Non-goals

- Separate `/blog` section
- Search, tag filter pages, comments, RSS
- Dark-mode-specific Notes polish
- Homepage visual redesign (beyond an optional Notes discovery link)
- Wide breakout / full-bleed article images as the default figure treatment

## Success criteria

- `/notes` and `/notes/[slug]` feel continuous with the editorial homepage (type, color, hairlines) but read as dedicated writing pages
- Featured + index pattern is obvious within one viewport on desktop
- Takeaways and reading time make short notes scannable before deep reading
- Multiple inline images with captions render cleanly without card chrome
- Mobile: readable stacked layout; TOC does not break the reading flow
- Lint/typecheck/build succeed; existing notes migrate or re-seed cleanly

## Open items resolved during brainstorming

- Brand fit: richer reading shell, not a separate blog aesthetic
- Length: short notes
- Index: featured + list; featured = manual or newest
- Detail: reading time + takeaways; layout B with TOC rail
- Images: inline column figures
- IA: single `/notes` writing area (not Notes + Blog split)
- Content model: portable body approved over “sections + image field only”
