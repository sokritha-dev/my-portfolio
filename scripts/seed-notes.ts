import "../sanity/env-loader.node";

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
      publishedAt: note.publishedAt,
      tags: note.tags,
      ...(note.series
        ? {
            series: {
              title: note.series.title,
              slug: {
                _type: "slug",
                current: note.series.slug,
              },
              part: note.series.part,
            },
          }
        : {}),
      takeaways: note.takeaways,
      body: note.body.map((block, index) => ({
        ...block,
        _key: `${note.slug}-body-${index}`,
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
