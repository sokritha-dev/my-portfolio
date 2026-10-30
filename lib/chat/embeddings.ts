import { GoogleGenAI } from "@google/genai";

import {
  CHAT_EMBEDDING_DIMENSIONS,
  CHAT_EMBEDDING_MODEL,
} from "@/lib/chat/config";

function client(apiKey: string) {
  return new GoogleGenAI({ apiKey });
}

/** Truncate + L2-normalize (Matryoshka) to match the Pinecone index size. */
function fitEmbedding(values: number[]): number[] {
  const truncated = values.slice(0, CHAT_EMBEDDING_DIMENSIONS);
  const norm = Math.sqrt(truncated.reduce((sum, value) => sum + value * value, 0));
  if (!norm) {
    return truncated;
  }
  return truncated.map((value) => value / norm);
}

export async function embedTexts(
  apiKey: string,
  texts: string[]
): Promise<number[][]> {
  if (texts.length === 0) {
    return [];
  }

  const ai = client(apiKey);
  const vectors: number[][] = [];

  const batchSize = 16;
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const result = await ai.models.embedContent({
      model: CHAT_EMBEDDING_MODEL,
      contents: batch,
      config: {
        taskType: "RETRIEVAL_DOCUMENT",
        outputDimensionality: CHAT_EMBEDDING_DIMENSIONS,
      },
    });

    for (const embedding of result.embeddings ?? []) {
      vectors.push(fitEmbedding(embedding.values ?? []));
    }
  }

  return vectors;
}

export async function embedQuery(
  apiKey: string,
  text: string
): Promise<number[]> {
  const ai = client(apiKey);
  const result = await ai.models.embedContent({
    model: CHAT_EMBEDDING_MODEL,
    contents: text,
    config: {
      taskType: "RETRIEVAL_QUERY",
      outputDimensionality: CHAT_EMBEDDING_DIMENSIONS,
    },
  });
  const values = result.embeddings?.[0]?.values ?? [];
  if (!values.length) {
    throw new Error("Failed to embed query");
  }
  return fitEmbedding(values);
}
