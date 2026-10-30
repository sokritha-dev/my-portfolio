/** Shared RAG settings — keep embed dims in sync with the Pinecone index. */
export const CHAT_EMBEDDING_MODEL = "gemini-embedding-001";
export const CHAT_EMBEDDING_DIMENSIONS = 768;
/**
 * Models available to new Gemini API users (2.5 family is blocked for new accounts).
 * Lite first for speed; 3.8 as fallback.
 */
export const CHAT_GENERATION_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
] as const;
export const CHAT_PINECONE_NAMESPACE = "portfolio";
export const CHAT_TOP_K = 5;
export const CHAT_CHUNK_SIZE = 900;
export const CHAT_CHUNK_OVERLAP = 120;
export const CHAT_MAX_MESSAGE_CHARS = 1000;
export const CHAT_RATE_LIMIT_WINDOW_MS = 60_000;
export const CHAT_RATE_LIMIT_MAX = 12;

export function requireChatEnv() {
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim();
  const pineconeApiKey = process.env.PINECONE_API_KEY?.trim();
  const pineconeIndexName = process.env.PINECONE_INDEX_NAME?.trim();

  if (!geminiApiKey) {
    throw new Error("Missing GEMINI_API_KEY");
  }
  if (!pineconeApiKey) {
    throw new Error("Missing PINECONE_API_KEY");
  }
  if (!pineconeIndexName) {
    throw new Error("Missing PINECONE_INDEX_NAME");
  }

  return { geminiApiKey, pineconeApiKey, pineconeIndexName };
}
