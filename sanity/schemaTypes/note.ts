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
      type: "date",
      validation: (Rule) => Rule.required(),
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
