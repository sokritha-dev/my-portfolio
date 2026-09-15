# Editorial Homepage Redesign

**Date:** 2026-09-15  
**Status:** Approved for planning  
**Scope:** Homepage visual redesign only (pixel-faithful to attached reference screenshots)

## Goal

Rebuild the portfolio homepage presentation to match the attached editorial UI: warm paper background, serif/sans typography pairing, top navigation, left rail section labels, hairline dividers, and no cards. Keep current CV-driven content in `lib/home-content.ts`. Leave `/notes` out of this redesign.

## Decisions

| Decision | Choice |
| --- | --- |
| Fidelity | A — pixel-faithful to screenshots |
| Notes | Out of scope for this pass (homepage only) |
| Approach | Rebuild homepage shell/components; keep content module |
| Accents | No Google rainbow borders; plain black outline primary CTA |
| Theme | Light editorial only; no dark mode work |

## Visual system

### Color

- Background: warm paper (~`#F7F6F2`)
- Ink / primary text: near-black charcoal
- Secondary text: medium gray for body/metadata
- Accent label: muted gold/ochre for category eyebrows (`Product strategy`, `Professional`, skill group headers)
- Dividers: light gray hairlines
- Status: single muted blue dot for availability indicator
- Availability rail: subtle vertical blue-gray accent bar on highlighted service block

### Typography

- Serif (high-contrast display): site name, hero title, approach titles, project titles, metric values, contact email — use **Playfair Display** via `next/font`
- Sans: navigation, body copy, labels, metadata, tech lists, CTAs — use **Source Sans 3** via `next/font` (clean, editorial-adjacent; not Inter/Roboto/Arial)
- Wire both as CSS variables on `<html>` in `app/layout.tsx`

### Layout primitives

- Max-width content container with generous horizontal padding
- Recurring **rail section**: narrow left label column + wide right content column
- Mobile: left label stacks above content
- Sections separated by full-width horizontal hairlines
- No card surfaces, soft blue glows, rounded marketing panels, or multi-layer shadows on the homepage

### Motion

- Optional subtle fade/slide on section enter only if it does not dominate
- Always respect `prefers-reduced-motion`
- No decorative mascots or heavy parallax

## Information architecture

Top-to-bottom homepage order:

1. Site header (name + in-page anchors)
2. Hero
3. By the numbers
4. Approach (value pillars)
5. Selected work (professional then personal)
6. Experience (roles + education + volunteering)
7. Skills
8. Availability
9. Contact + footer credit

In-page anchors: `#work`, `#experience`, `#skills`, `#contact` (and optionally `#availability` if needed; header links match the reference: Work, Experience, Skills, Contact).

## Section specs

### Header

- Left: serif “Yen Sokritha”
- Right: sans links Work / Experience / Skills / Contact
- Sticky top bar with a light hairline bottom so anchors remain reachable while scrolling
- Remove homepage usage of left vertical About/Notes Google-border pills

### Hero

- Small gray name/label in left margin style as reference
- Blue status dot + availability badge text from `heroContent.badge`
- Large serif title from `heroContent.title`
- Sans subhead emphasizing 4+ years (can derive from metrics or a short dedicated line in content if needed)
- Body from `heroContent.description`
- Primary CTA: rectangular outline button (black border, transparent fill) → mailto
- Secondary CTA: underlined text link → `/cv.pdf`
- Process rail under CTAs with labels: `query`, `embedding`, `vector index`, `results`, and a marker near `vector index`

### By the numbers

- Left rail label: “By the numbers”
- Three metric columns from `featuredMetrics`, separated by vertical hairlines
- Large serif values; small sans labels

### Approach

- Left rail label: “Approach”
- Stack `valuePillars`: gold eyebrow, serif title, description, bullet list
- Hairline between pillars as in reference

### Selected work

- Left rail label: “Selected work”
- Group headers gold: Professional / Personal from `featuredProjects[].group`
- Each project: serif title; `category | date` metadata; description + impact paragraphs; spaced tech labels (not chips); optional underlined “View project” when `link` exists
- Hairlines between projects

### Experience

- Left rail label: “Experience”
- Timeline from `experiences` (title, organization, period, description)
- Education from `education`
- Community/volunteering from `communityHighlights`
- Same editorial typography; no cards

### Skills

- Left rail label: “Skills”
- Multi-column grid of `skillGroups`
- Gold category headers; plain sans skill lists

### Availability

- Left rail label: “Availability”
- Vertical accent bar beside content
- Three options from `availabilityOptions`: serif title, summary, bullets
- Highlight flag may strengthen the accent on the featured option

### Contact / footer

- Left rail label: “Contact”
- Prompt line + large underlined serif email (`sokritha.dev@gmail.com`)
- Text links: LinkedIn, Resume, Notes (Notes may remain as a footer/contact link even though Notes UX is out of scope)
- Footer credit: “Yen Sokritha — built with care.”

## Technical plan (high level)

### Keep

- `lib/home-content.ts` as content source of truth
- App Router structure; `app/_components/home/home-page.tsx` as homepage composer
- Existing `/notes` routes and content (unchanged)

### Change

- `app/globals.css`: replace homepage-facing tokens (paper/ink/gold/hairline); remove reliance on blue hero-glow marketing look for the home surface
- `app/layout.tsx`: serif + sans font variables; metadata may stay CV-aligned
- New top `SiteHeader` for homepage (replace left `SiteNavigation` on home)
- Rewrite home section components to rail layout and editorial typography
- Simplify/remove card-oriented helpers used only by the old home look (`project-card` chip/card treatment, Google border utilities if unused)

### Content changes

- Prefer zero or minimal content edits
- Allow small structural additions only if required for layout fidelity (e.g. hero subhead string, process-rail labels constant)

## Non-goals

- Redesigning `/notes` pages
- Dark mode
- Mascot / illustration work
- Changing CV PDF or contact email
- Pixel-chasing animation beyond subtle optional reveals

## Success criteria

- Homepage visually matches the attached screenshots in layout, hierarchy, color, and typography character
- Content remains accurate to the current CV-driven `home-content.ts`
- Mobile: readable stacked rail layout; no broken overflow
- `/notes` still works as before
- Lint/typecheck/build succeed for homepage changes (fix unrelated pre-existing Sanity notes issues only if they block build; prefer not expanding scope)

## Open items resolved during brainstorming

- Fidelity: pixel-faithful
- Notes: homepage-only redesign
- Implementation approach: rebuild homepage presentation
