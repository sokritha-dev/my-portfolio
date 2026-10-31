import { createReadStream } from "fs";
import { resolve } from "path";

import "../sanity/env-loader.node";

import { getCliClient } from "sanity/cli";

import {
  whatIsAnLlmBodyWithoutImages,
  whatIsAnLlmNoteMeta,
} from "../lib/notes-seed-what-is-an-llm";

const client = getCliClient();
const slug = whatIsAnLlmNoteMeta.slug;

const nextWordImagePath = resolve(
  process.cwd(),
  "public/notes/llm-next-word-guess.jpg"
);

async function uploadImage(filePath: string, filename: string) {
  return client.assets.upload("image", createReadStream(filePath), {
    filename,
    contentType: "image/jpeg",
  });
}

async function seedWhatIsAnLlmNote() {
  console.log("Uploading next-word chart…");
  const nextWordAsset = await uploadImage(
    nextWordImagePath,
    "llm-next-word-guess.jpg"
  );

  const nextWordImageBlock = {
    _type: "noteImage" as const,
    alt: 'Bars showing how likely each next word is for "The cat sat on the": mat is highest, then floor, sofa, and moon is lowest. The numbers are made up for illustration.',
    caption:
      "Made-up next-word scores for illustration. Real LLMs pick a likely word and continue — they do not show you a chart.",
    image: {
      _type: "image" as const,
      asset: {
        _type: "reference" as const,
        _ref: nextWordAsset._id,
      },
    },
  };

  const bodySource = [...whatIsAnLlmBodyWithoutImages];

  const afterGuessIntro = bodySource.findIndex(
    (block) =>
      block._type === "noteParagraph" &&
      block.text.includes("gives each possible next word a score")
  );
  if (afterGuessIntro < 0) {
    throw new Error("Could not find next-word paragraph for image insert.");
  }
  bodySource.splice(afterGuessIntro + 1, 0, nextWordImageBlock as never);

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
    title: whatIsAnLlmNoteMeta.title,
    slug: {
      _type: "slug",
      current: slug,
    },
    publishedAt: whatIsAnLlmNoteMeta.publishedAt,
    tags: whatIsAnLlmNoteMeta.tags,
    ...(whatIsAnLlmNoteMeta.series
      ? {
          series: {
            title: whatIsAnLlmNoteMeta.series.title,
            slug: {
              _type: "slug",
              current: whatIsAnLlmNoteMeta.series.slug,
            },
            part: whatIsAnLlmNoteMeta.series.part,
          },
        }
      : {}),
    takeaways: whatIsAnLlmNoteMeta.takeaways,
    body,
  });

  console.log(`Seeded note: /notes/${slug}`);
  console.log(`publishedAt: ${whatIsAnLlmNoteMeta.publishedAt}`);
}

seedWhatIsAnLlmNote().catch((error) => {
  console.error(error);
  process.exit(1);
});
