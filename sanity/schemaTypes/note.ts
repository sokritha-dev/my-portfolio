import { defineArrayMember, defineField, defineType } from "sanity";

import { NOTE_TECHNOLOGY_TAGS } from "../../lib/note-technology-tags";

export const note = defineType({
  name: "note",
  title: "Note",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published at",
      type: "datetime",
      description:
        "Notes with a future date stay hidden until that time (and until the next site rebuild on static export).",
      validation: (Rule) => Rule.required(),
      options: {
        timeStep: 15,
      },
    }),
    defineField({
      name: "tags",
      title: "Technology tags",
      description:
        "What technology areas this note teaches — e.g. AI, Frontend, Backend, Database. Used to filter notes on the site.",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: NOTE_TECHNOLOGY_TAGS.map((tag) => ({
          title: tag,
          value: tag,
        })),
        layout: "grid",
      },
      validation: (Rule) => Rule.min(1).unique(),
    }),
    defineField({
      name: "series",
      title: "Series",
      type: "object",
      description:
        "Optional. Use when this note is one part of a multi-part topic.",
      fields: [
        defineField({
          name: "title",
          title: "Series title",
          type: "string",
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "slug",
          title: "Series slug",
          type: "slug",
          options: {
            source: "series.title",
            maxLength: 96,
          },
          validation: (Rule) => Rule.required(),
        }),
        defineField({
          name: "part",
          title: "Part number",
          type: "number",
          validation: (Rule) => Rule.required().integer().min(1),
        }),
      ],
    }),
    defineField({
      name: "relatedNotes",
      title: "Related notes",
      description:
        "Optional. Curated links shown under this note. Order here is the order on the page.",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "note" }],
          options: {
            disableNew: true,
          },
        }),
      ],
      validation: (Rule) =>
        Rule.max(4).unique().custom((refs, context) => {
          if (!refs?.length) {
            return true;
          }
          const selfId = context.document?._id?.replace(/^drafts\./, "");
          const pointsToSelf = refs.some((ref) => {
            if (!ref || typeof ref !== "object" || !("_ref" in ref)) {
              return false;
            }
            return ref._ref === selfId || ref._ref === `drafts.${selfId}`;
          });
          return pointsToSelf ? "A note cannot relate to itself" : true;
        }),
    }),
    defineField({
      name: "takeaways",
      title: "Key takeaways",
      description:
        "Short answers to the core questions — what, when, where, who, how — so readers grasp the idea before the full note.",
      type: "array",
      of: [{ type: "string" }],
      validation: (Rule) => Rule.required().min(1).max(5),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "noteHeading",
          title: "Heading",
          fields: [
            defineField({
              name: "heading",
              title: "Heading",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "heading" },
            prepare: ({ title }) => ({ title: title || "Heading" }),
          },
        }),
        defineArrayMember({
          type: "object",
          name: "noteParagraph",
          title: "Paragraph",
          fields: [
            defineField({
              name: "text",
              title: "Text",
              type: "text",
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: "text" },
            prepare: ({ title }) => ({
              title: title ? String(title).slice(0, 80) : "Paragraph",
            }),
          },
        }),
        defineArrayMember({
          type: "object",
          name: "noteBullets",
          title: "Bullets",
          fields: [
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { items: "items" },
            prepare: ({ items }) => ({
              title: Array.isArray(items)
                ? `${items.length} bullet${items.length === 1 ? "" : "s"}`
                : "Bullets",
            }),
          },
        }),
        defineArrayMember({
          type: "object",
          name: "noteTable",
          title: "Table",
          fields: [
            defineField({
              name: "caption",
              title: "Caption (optional)",
              type: "string",
            }),
            defineField({
              name: "headers",
              title: "Header row",
              type: "array",
              of: [{ type: "string" }],
              validation: (Rule) => Rule.required().min(1),
            }),
            defineField({
              name: "rows",
              title: "Rows",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  name: "noteTableRow",
                  fields: [
                    defineField({
                      name: "cells",
                      title: "Cells",
                      type: "array",
                      of: [{ type: "string" }],
                      validation: (Rule) => Rule.required().min(1),
                    }),
                  ],
                  preview: {
                    select: { cells: "cells" },
                    prepare: ({ cells }) => ({
                      title: Array.isArray(cells)
                        ? cells.join(" · ")
                        : "Row",
                    }),
                  },
                }),
              ],
              validation: (Rule) => Rule.required().min(1),
            }),
          ],
          preview: {
            select: { headers: "headers", rows: "rows", caption: "caption" },
            prepare: ({ headers, rows, caption }) => ({
              title: caption || "Table",
              subtitle: Array.isArray(headers)
                ? `${headers.length} cols · ${Array.isArray(rows) ? rows.length : 0} rows`
                : undefined,
            }),
          },
        }),
        defineArrayMember({
          type: "object",
          name: "noteImage",
          title: "Image",
          fields: [
            defineField({
              name: "image",
              title: "Image",
              type: "image",
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "alt",
              title: "Alt text",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Caption",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "alt", media: "image" },
            prepare: ({ title, media }) => ({
              title: title || "Image",
              media,
            }),
          },
        }),
        defineArrayMember({
          type: "object",
          name: "noteCode",
          title: "Code",
          fields: [
            defineField({
              name: "code",
              title: "Code",
              type: "text",
              rows: 12,
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "language",
              title: "Language",
              type: "string",
              options: {
                list: [
                  { title: "TypeScript", value: "typescript" },
                  { title: "TSX", value: "tsx" },
                  { title: "JavaScript", value: "javascript" },
                  { title: "JSX", value: "jsx" },
                  { title: "Python", value: "python" },
                  { title: "SQL", value: "sql" },
                  { title: "Bash", value: "bash" },
                  { title: "JSON", value: "json" },
                  { title: "CSS", value: "css" },
                  { title: "HTML", value: "html" },
                  { title: "Plain text", value: "text" },
                ],
                layout: "dropdown",
              },
              initialValue: "typescript",
            }),
            defineField({
              name: "filename",
              title: "Filename (optional)",
              type: "string",
              description: "Shown above the block, e.g. app/api/route.ts",
            }),
          ],
          preview: {
            select: { code: "code", language: "language", filename: "filename" },
            prepare: ({ code, language, filename }) => ({
              title: filename || (language ? `Code · ${language}` : "Code"),
              subtitle: code ? String(code).slice(0, 80) : undefined,
            }),
          },
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Published date, newest",
      name: "publishedAtDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "publishedAt",
      seriesTitle: "series.title",
      part: "series.part",
    },
    prepare: ({ title, subtitle, seriesTitle, part }) => ({
      title:
        seriesTitle && part
          ? `${title} (${seriesTitle} · ${part})`
          : title,
      subtitle,
    }),
  },
});
