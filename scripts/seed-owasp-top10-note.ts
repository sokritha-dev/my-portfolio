import "../sanity/env-loader.node";

import { getCliClient } from "sanity/cli";

import {
  owaspTop10Body,
  owaspTop10NoteMeta,
} from "../lib/notes-seed-owasp-top10";

const client = getCliClient();
const slug = owaspTop10NoteMeta.slug;

async function seedOwaspTop10Note() {
  const body = owaspTop10Body.map((block, index) => {
    const withKey = {
      ...block,
      _key: `${slug}-body-${index}`,
    };

    if (block._type === "noteTable") {
      return {
        ...withKey,
        rows: block.rows.map((row, rowIndex) => ({
          _type: "noteTableRow",
          _key: `${slug}-body-${index}-row-${rowIndex}`,
          cells: row.cells,
        })),
      };
    }

    return withKey;
  });

  await client.createOrReplace({
    _id: `note-${slug}`,
    _type: "note",
    title: owaspTop10NoteMeta.title,
    slug: {
      _type: "slug",
      current: slug,
    },
    publishedAt: owaspTop10NoteMeta.publishedAt,
    tags: owaspTop10NoteMeta.tags,
    ...(owaspTop10NoteMeta.series
      ? {
          series: {
            title: owaspTop10NoteMeta.series.title,
            slug: {
              _type: "slug",
              current: owaspTop10NoteMeta.series.slug,
            },
            part: owaspTop10NoteMeta.series.part,
          },
        }
      : {}),
    takeaways: owaspTop10NoteMeta.takeaways,
    body,
  });

  console.log(`Seeded note: /notes/${slug}`);
}

seedOwaspTop10Note().catch((error) => {
  console.error(error);
  process.exit(1);
});
