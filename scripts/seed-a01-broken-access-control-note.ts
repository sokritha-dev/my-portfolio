import "../sanity/env-loader.node";

import { getCliClient } from "sanity/cli";

import {
  a01BrokenAccessControlBody,
  a01BrokenAccessControlNoteMeta,
} from "../lib/notes-seed-a01-broken-access-control";

const client = getCliClient();
const slug = a01BrokenAccessControlNoteMeta.slug;

async function seedA01BrokenAccessControlNote() {
  const body = a01BrokenAccessControlBody.map((block, index) => {
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
    title: a01BrokenAccessControlNoteMeta.title,
    slug: {
      _type: "slug",
      current: slug,
    },
    publishedAt: a01BrokenAccessControlNoteMeta.publishedAt,
    tags: a01BrokenAccessControlNoteMeta.tags,
    ...(a01BrokenAccessControlNoteMeta.series
      ? {
          series: {
            title: a01BrokenAccessControlNoteMeta.series.title,
            slug: {
              _type: "slug",
              current: a01BrokenAccessControlNoteMeta.series.slug,
            },
            part: a01BrokenAccessControlNoteMeta.series.part,
          },
        }
      : {}),
    takeaways: a01BrokenAccessControlNoteMeta.takeaways,
    body,
  });

  console.log(`Seeded note: /notes/${slug}`);
}

seedA01BrokenAccessControlNote().catch((error) => {
  console.error(error);
  process.exit(1);
});
