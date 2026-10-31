/**
 * Index About + Sanity notes into Pinecone for portfolio chat.
 *
 * Requires in .env.local:
 *   GEMINI_API_KEY
 *   PINECONE_API_KEY
 *   PINECONE_INDEX_NAME
 *   NEXT_PUBLIC_SANITY_* (for notes)
 *
 * Usage:
 *   npm run chat:index
 *   npm run chat:index -- --slug=what-is-an-llm
 */

import { config as loadEnv } from "dotenv";
import { resolve } from "path";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

function parseSlugArg(argv: string[]): string | null {
  for (const arg of argv) {
    if (arg.startsWith("--slug=")) {
      return arg.slice("--slug=".length).trim() || null;
    }
  }

  const flagIndex = argv.indexOf("--slug");
  if (flagIndex >= 0) {
    return argv[flagIndex + 1]?.trim() || null;
  }

  return null;
}

async function main() {
  const slug = parseSlugArg(process.argv.slice(2));
  const { requireChatEnv } = await import("../lib/chat/config");
  const {
    buildPortfolioChunks,
    buildNoteChunksBySlug,
  } = await import("../lib/chat/notes-corpus");
  const { embedTexts } = await import("../lib/chat/embeddings");
  const {
    ensurePineconeIndex,
    upsertPortfolioChunks,
    deletePortfolioChunksBySlug,
  } = await import("../lib/chat/pinecone");

  const { geminiApiKey, pineconeApiKey, pineconeIndexName } = requireChatEnv();

  console.log(
    slug
      ? `Building chunks for note "${slug}"…`
      : "Building full corpus…"
  );
  const chunks = slug
    ? await buildNoteChunksBySlug(slug)
    : await buildPortfolioChunks();
  console.log(`Chunks: ${chunks.length}`);

  if (chunks.length === 0) {
    throw new Error("No chunks to index");
  }

  console.log(`Ensuring Pinecone index "${pineconeIndexName}"…`);
  await ensurePineconeIndex({
    apiKey: pineconeApiKey,
    indexName: pineconeIndexName,
  });

  if (slug) {
    console.log(`Removing previous vectors for "${slug}"…`);
    await deletePortfolioChunksBySlug({
      apiKey: pineconeApiKey,
      indexName: pineconeIndexName,
      slug,
    });
  }

  console.log("Embedding with Gemini…");
  const vectors = await embedTexts(
    geminiApiKey,
    chunks.map((chunk) => chunk.text)
  );

  console.log("Upserting to Pinecone…");
  await upsertPortfolioChunks({
    apiKey: pineconeApiKey,
    indexName: pineconeIndexName,
    chunks,
    vectors,
  });

  console.log(
    slug
      ? `Indexed ${chunks.length} chunks for /notes/${slug}`
      : `Indexed ${chunks.length} chunks into ${pineconeIndexName}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
