import { Pinecone } from "@pinecone-database/pinecone";

import {
  CHAT_EMBEDDING_DIMENSIONS,
  CHAT_PINECONE_NAMESPACE,
  CHAT_TOP_K,
} from "@/lib/chat/config";
import type { PortfolioChunk } from "@/lib/chat/chunk";

export type RetrievedChunk = {
  id: string;
  score: number;
  title: string;
  url: string;
  text: string;
  source: string;
  slug?: string;
};

type IndexHandle = ReturnType<Pinecone["index"]>;

const indexCache = new Map<string, IndexHandle>();

export function getPineconeIndex(apiKey: string, indexName: string) {
  const cacheKey = `${apiKey.slice(0, 8)}:${indexName}`;
  const cached = indexCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const pinecone = new Pinecone({ apiKey });
  const index = pinecone.index({ name: indexName });
  indexCache.set(cacheKey, index);
  return index;
}

export async function ensurePineconeIndex(input: {
  apiKey: string;
  indexName: string;
}) {
  const pinecone = new Pinecone({ apiKey: input.apiKey });
  const existing = await pinecone.indexes.list();
  const names = new Set((existing.indexes ?? []).map((index) => index.name));

  if (names.has(input.indexName)) {
    return;
  }

  await pinecone.indexes.create({
    name: input.indexName,
    schema: {
      fields: {
        _values: {
          type: "dense_vector",
          dimension: CHAT_EMBEDDING_DIMENSIONS,
          metric: "cosine",
        },
      },
    },
    deployment: {
      deploymentType: "managed",
      cloud: "aws",
      region: "us-east-1",
    },
    waitUntilReady: true,
  });
}

export async function upsertPortfolioChunks(input: {
  apiKey: string;
  indexName: string;
  chunks: PortfolioChunk[];
  vectors: number[][];
}) {
  if (input.chunks.length !== input.vectors.length) {
    throw new Error("Chunk and vector counts do not match");
  }

  const index = getPineconeIndex(input.apiKey, input.indexName).namespace(
    CHAT_PINECONE_NAMESPACE
  );

  const records = input.chunks.map((chunk, i) => ({
    id: chunk.id,
    values: input.vectors[i],
    metadata: {
      text: chunk.text,
      title: chunk.title,
      url: chunk.url,
      source: chunk.source,
      ...(chunk.slug ? { slug: chunk.slug } : {}),
    },
  }));

  const batchSize = 100;
  for (let i = 0; i < records.length; i += batchSize) {
    await index.upsert({ records: records.slice(i, i + batchSize) });
  }
}

/** Remove existing vectors for a note before re-upserting (handles shorter edits). */
export async function deletePortfolioChunksBySlug(input: {
  apiKey: string;
  indexName: string;
  slug: string;
}) {
  const index = getPineconeIndex(input.apiKey, input.indexName).namespace(
    CHAT_PINECONE_NAMESPACE
  );

  await index.deleteMany({
    filter: { slug: { $eq: input.slug } },
  });
}

export async function queryPortfolioChunks(input: {
  apiKey: string;
  indexName: string;
  vector: number[];
  topK?: number;
}): Promise<RetrievedChunk[]> {
  const index = getPineconeIndex(input.apiKey, input.indexName).namespace(
    CHAT_PINECONE_NAMESPACE
  );

  const result = await index.query({
    vector: input.vector,
    topK: input.topK ?? CHAT_TOP_K,
    includeMetadata: true,
  });

  const retrieved: RetrievedChunk[] = [];

  for (const match of result.matches ?? []) {
    const metadata = match.metadata ?? {};
    const text = typeof metadata.text === "string" ? metadata.text : "";
    const title = typeof metadata.title === "string" ? metadata.title : "";
    const url = typeof metadata.url === "string" ? metadata.url : "";
    const source =
      typeof metadata.source === "string" ? metadata.source : "unknown";
    const slug =
      typeof metadata.slug === "string" ? metadata.slug : undefined;

    if (!text || !title || !url) {
      continue;
    }

    retrieved.push({
      id: match.id,
      score: match.score ?? 0,
      title,
      url,
      text,
      source,
      slug,
    });
  }

  return retrieved;
}
