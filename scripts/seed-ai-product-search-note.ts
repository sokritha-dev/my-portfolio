import { createReadStream } from "fs";
import { resolve } from "path";

import "../sanity/env-loader.node";

import { getCliClient } from "sanity/cli";

import {
  aiProductSearchBodyWithoutFlowImage,
  aiProductSearchNoteMeta,
} from "../lib/notes-seed-ai-product-search";

const client = getCliClient();
const slug = aiProductSearchNoteMeta.slug;
const flowImagePath = resolve(
  process.cwd(),
  "public/notes/ai-product-search-flow.jpg"
);

async function seedAiProductSearchNote() {
  console.log("Uploading flow diagram…");
  const imageAsset = await client.assets.upload(
    "image",
    createReadStream(flowImagePath),
    {
      filename: "ai-product-search-flow.jpg",
      contentType: "image/jpeg",
    }
  );

  const flowImageBlock = {
    _type: "noteImage" as const,
    alt: "AI product search flow: data pipeline on top, search path below",
    caption: "Data pipeline (background) and search path (when a user searches).",
    image: {
      _type: "image" as const,
      asset: {
        _type: "reference" as const,
        _ref: imageAsset._id,
      },
    },
  };

  const insertAfterHeading = "The big picture";
  const bodySource = [...aiProductSearchBodyWithoutFlowImage];
  const insertIndex =
    bodySource.findIndex(
      (block) =>
        block._type === "noteHeading" &&
        block.heading === "Part 1: Building the data pipeline"
    ) ?? -1;

  if (insertIndex < 0) {
    throw new Error(
      `Could not find insertion point after "${insertAfterHeading}".`
    );
  }

  bodySource.splice(insertIndex, 0, flowImageBlock as never);

  const body = bodySource.map((block, index) => {
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
    title: aiProductSearchNoteMeta.title,
    slug: {
      _type: "slug",
      current: slug,
    },
    publishedAt: aiProductSearchNoteMeta.publishedAt,
    tags: aiProductSearchNoteMeta.tags,
    takeaways: aiProductSearchNoteMeta.takeaways,
    body,
  });

  console.log(`Seeded note: /notes/${slug}`);
}

seedAiProductSearchNote().catch((error) => {
  console.error(error);
  process.exit(1);
});
