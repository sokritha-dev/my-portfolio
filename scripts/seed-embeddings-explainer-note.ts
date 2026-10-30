import { createReadStream } from "fs";
import { resolve } from "path";

import "../sanity/env-loader.node";

import { getCliClient } from "sanity/cli";

import {
  embeddingsExplainerBodyWithoutImages,
  embeddingsExplainerNoteMeta,
} from "../lib/notes-seed-embeddings-explainer";

const client = getCliClient();
const slug = embeddingsExplainerNoteMeta.slug;

const vectorImagePath = resolve(
  process.cwd(),
  "public/notes/embeddings-vector-as-point.jpg"
);
const productMapImagePath = resolve(
  process.cwd(),
  "public/notes/embeddings-product-map.jpg"
);
const cosineImagePath = resolve(
  process.cwd(),
  "public/notes/embeddings-cosine-close.jpg"
);

async function uploadImage(filePath: string, filename: string) {
  return client.assets.upload("image", createReadStream(filePath), {
    filename,
    contentType: "image/jpeg",
  });
}

async function seedEmbeddingsExplainerNote() {
  console.log("Uploading vector diagram…");
  const vectorAsset = await uploadImage(
    vectorImagePath,
    "embeddings-vector-as-point.jpg"
  );

  console.log("Uploading product map diagram…");
  const productMapAsset = await uploadImage(
    productMapImagePath,
    "embeddings-product-map.jpg"
  );

  console.log("Uploading cosine similarity diagram…");
  const cosineAsset = await uploadImage(
    cosineImagePath,
    "embeddings-cosine-close.jpg"
  );

  const vectorImageBlock = {
    _type: "noteImage" as const,
    alt: "A grid with an arrow 3 steps east and 4 steps north, ending at the point (3, 4)",
    caption: "A vector is a point: (3, 4) means 3 steps east, 4 steps north.",
    image: {
      _type: "image" as const,
      asset: {
        _type: "reference" as const,
        _ref: vectorAsset._id,
      },
    },
  };

  const productMapImageBlock = {
    _type: "noteImage" as const,
    alt: "The four products plotted on a warm vs formal map: warm items on the right, cool items on the left, with the winter query near the fleece jacket",
    caption:
      "Toy 2D embedding map: similar products land near each other; the winter query sits closest to the fleece jacket.",
    image: {
      _type: "image" as const,
      asset: {
        _type: "reference" as const,
        _ref: productMapAsset._id,
      },
    },
  };

  const cosineImageBlock = {
    _type: "noteImage" as const,
    alt: "Three arrows from the origin: the query and fleece jacket point nearly the same way (high score), while the linen shirt points the opposite way (low score)",
    caption:
      "Cosine similarity: same direction means similar meaning. Fleece is close to the query; linen points the other way.",
    image: {
      _type: "image" as const,
      asset: {
        _type: "reference" as const,
        _ref: cosineAsset._id,
      },
    },
  };

  const bodySource = [...embeddingsExplainerBodyWithoutImages];

  const afterVectorPara = bodySource.findIndex(
    (block) =>
      block._type === "noteParagraph" &&
      block.text.includes("3 steps east, 4 steps north")
  );
  if (afterVectorPara < 0) {
    throw new Error("Could not find vector paragraph for image insert.");
  }
  bodySource.splice(afterVectorPara + 1, 0, vectorImageBlock as never);

  const afterMapIntro = bodySource.findIndex(
    (block) =>
      block._type === "noteParagraph" &&
      block.text.includes("Draw them as points on a page and you get a map")
  );
  if (afterMapIntro < 0) {
    throw new Error("Could not find product-map paragraph for image insert.");
  }
  bodySource.splice(afterMapIntro + 1, 0, productMapImageBlock as never);

  const afterCosinePara = bodySource.findIndex(
    (block) =>
      block._type === "noteParagraph" &&
      block.text.includes("The most common answer is cosine similarity")
  );
  if (afterCosinePara < 0) {
    throw new Error("Could not find cosine paragraph for image insert.");
  }
  bodySource.splice(afterCosinePara + 1, 0, cosineImageBlock as never);

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
    title: embeddingsExplainerNoteMeta.title,
    slug: {
      _type: "slug",
      current: slug,
    },
    publishedAt: embeddingsExplainerNoteMeta.publishedAt,
    tags: embeddingsExplainerNoteMeta.tags,
    takeaways: embeddingsExplainerNoteMeta.takeaways,
    body,
  });

  console.log(`Seeded note: /notes/${slug}`);
  console.log(
    `Scheduled publishedAt: ${embeddingsExplainerNoteMeta.publishedAt} (tomorrow 8:00 AM ICT)`
  );
}

seedEmbeddingsExplainerNote().catch((error) => {
  console.error(error);
  process.exit(1);
});
