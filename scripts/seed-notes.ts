import "./sanity/env-loader.node";

import { getCliClient } from "sanity/cli";

import { seedNotes } from "../lib/notes-seed-data";

const client = getCliClient();

async function seedNotesToSanity() {
  const transaction = client.transaction();

  for (const note of seedNotes) {
    transaction.createOrReplace({
      _id: `note-${note.slug}`,
      _type: "note",
      title: note.title,
      slug: {
        _type: "slug",
        current: note.slug,
      },
      summary: note.summary,
      publishedAt: note.publishedAt,
      tags: note.tags,
      sections: note.sections.map((section, index) => ({
        _type: "section",
        _key: `${note.slug}-section-${index}`,
        heading: section.heading,
        paragraphs: section.paragraphs,
        bullets: section.bullets ?? [],
      })),
    });
  }

  await transaction.commit();
  console.log(`Seeded ${seedNotes.length} notes to Sanity.`);
}

seedNotesToSanity().catch((error) => {
  console.error(error);
  process.exit(1);
});
