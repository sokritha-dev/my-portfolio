/**
 * Index About + Sanity notes into Pinecone for portfolio chat.
 *
 * Requires in .env.local:
 *   GEMINI_API_KEY
 *   PINECONE_API_KEY
 *   PINECONE_INDEX_NAME
 *   NEXT_PUBLIC_SANITY_* (for notes)
 *
 * Usage: npm run chat:index
 */

import { config as loadEnv } from "dotenv";
import { resolve } from "path";

loadEnv({ path: resolve(process.cwd(), ".env.local") });
loadEnv({ path: resolve(process.cwd(), ".env") });

async function main() {
  const { requireChatEnv } = await import("../lib/chat/config");
  const { buildPortfolioChunks } = await import("../lib/chat/notes-corpus");
  const { embedTexts } = await import("../lib/chat/embeddings");
  const {
    ensurePineconeIndex,
    upsertPortfolioChunks,
  } = await import("../lib/chat/pinecone");

  const { geminiApiKey, pineconeApiKey, pineconeIndexName } = requireChatEnv();

  console.log("Building corpus…");
  const chunks = await buildPortfolioChunks();
  console.log(`Chunks: ${chunks.length}`);

  if (chunks.length === 0) {
    throw new Error("No chunks to index");
  }

  console.log(`Ensuring Pinecone index "${pineconeIndexName}"…`);
  await ensurePineconeIndex({
    apiKey: pineconeApiKey,
    indexName: pineconeIndexName,
  });

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

  console.log(`Indexed ${chunks.length} chunks into ${pineconeIndexName}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
