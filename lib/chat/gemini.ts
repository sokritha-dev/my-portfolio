import {
  GoogleGenAI,
  type Content,
  type FunctionCall,
  type Part,
} from "@google/genai";

import { CHAT_GENERATION_MODELS } from "@/lib/chat/config";
import {
  executePortfolioTool,
  portfolioToolDeclarations,
} from "@/lib/portfolio-tools";

const MAX_TOOL_ROUNDS = 4;

const SYSTEM_INSTRUCTION = [
  "You are a helpful assistant for Yen Sokritha's portfolio website.",
  "Use get_portfolio_stats for who he is, bio, experience, skills, education, contact, and counts.",
  "Use other tools for project lists/details, note lists, a specific note, or deep note search.",
  "Use search_notes for deep questions about note content (security, embeddings, search, etc.).",
  "You may call multiple tools when needed.",
  "Answer ONLY from tool results. If tools do not have the answer, say you do not have that information on this portfolio.",
  "Keep answers short: usually 2-4 sentences. No long essays.",
  "When a note or page is relevant, mention its title and path (for example /notes/some-slug).",
  "For contact questions: one short plain sentence only. Do not use markdown links. Do not paste raw URLs. Mention email, LinkedIn, and resume by name; the UI shows contact cards.",
  "Do not invent experience, employers, projects, or note content.",
].join(" ");

function client(apiKey: string) {
  return new GoogleGenAI({ apiKey });
}

function isRetryableModelError(error: unknown): boolean {
  if (!error || typeof error !== "object") {
    return false;
  }
  const status =
    "status" in error
      ? Number(error.status)
      : "statusCode" in error
        ? Number(error.statusCode)
        : NaN;
  if (status === 400 || status === 404) {
    return true;
  }
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("[400") ||
    message.includes("[404") ||
    message.includes("not found") ||
    message.includes("thought_signature")
  );
}

function generationConfig() {
  return {
    systemInstruction: SYSTEM_INSTRUCTION,
    tools: [{ functionDeclarations: portfolioToolDeclarations }],
    maxOutputTokens: 400,
    temperature: 0.2,
  };
}

function functionCallsFromParts(parts: Part[] | undefined): FunctionCall[] {
  if (!parts?.length) {
    return [];
  }
  return parts
    .map((part) => part.functionCall)
    .filter((call): call is FunctionCall => Boolean(call?.name));
}

/** Merge streamed model parts while keeping thoughtSignature on each part. */
function appendModelParts(target: Part[], incoming: Part[] | undefined) {
  if (!incoming?.length) {
    return;
  }

  for (const part of incoming) {
    if (part.functionCall) {
      target.push({ ...part });
      continue;
    }

    if (typeof part.text === "string") {
      const last = target[target.length - 1];
      if (
        last &&
        typeof last.text === "string" &&
        !last.functionCall &&
        !last.functionResponse
      ) {
        last.text += part.text;
        if (part.thoughtSignature) {
          last.thoughtSignature = part.thoughtSignature;
        }
        if (part.thought !== undefined) {
          last.thought = part.thought;
        }
      } else {
        target.push({ ...part });
      }
      continue;
    }

    target.push({ ...part });
  }
}

async function runToolCalls(calls: FunctionCall[]): Promise<Part[]> {
  const parts: Part[] = [];

  for (const call of calls) {
    const name = call.name;
    if (!name) {
      continue;
    }
    const args = (call.args ?? {}) as Record<string, unknown>;
    console.info(`[chat] tool=${name}`, args);
    const result = await executePortfolioTool(name, args);
    parts.push({
      functionResponse: {
        name,
        response: { result },
        ...(call.id ? { id: call.id } : {}),
      },
    });
  }

  return parts;
}

/**
 * First turn uses non-streaming so Gemini 3 thoughtSignature on functionCall
 * parts is preserved. After tools, stream the answer token-by-token.
 */
async function* streamWithToolsOnModel(input: {
  apiKey: string;
  modelName: string;
  question: string;
}): AsyncGenerator<string> {
  const ai = client(input.apiKey);
  const contents: Content[] = [
    { role: "user", parts: [{ text: input.question }] },
  ];

  for (let round = 0; round < MAX_TOOL_ROUNDS; round += 1) {
    const afterTools = contents.some((content) =>
      content.parts?.some((part) => Boolean(part.functionResponse))
    );

    if (afterTools) {
      const stream = await ai.models.generateContentStream({
        model: input.modelName,
        contents,
        config: generationConfig(),
      });

      const modelParts: Part[] = [];
      let streamedText = false;

      for await (const chunk of stream) {
        appendModelParts(modelParts, chunk.candidates?.[0]?.content?.parts);

        const chunkCalls = chunk.functionCalls;
        if (chunkCalls?.length) {
          continue;
        }

        const text = chunk.text;
        if (!text) {
          continue;
        }
        streamedText = true;
        yield text;
      }

      const calls = functionCallsFromParts(modelParts);
      if (!calls.length) {
        if (!streamedText) {
          const text = modelParts
            .map((part) => part.text ?? "")
            .join("")
            .trim();
          if (!text) {
            throw new Error("Empty model response after tools");
          }
          yield text;
        }
        return;
      }

      contents.push({ role: "model", parts: modelParts });
      contents.push({
        role: "user",
        parts: await runToolCalls(calls),
      });
      continue;
    }

    // Initial turn: non-stream so functionCall thoughtSignature is intact.
    const response = await ai.models.generateContent({
      model: input.modelName,
      contents,
      config: generationConfig(),
    });

    const modelContent = response.candidates?.[0]?.content;
    const calls = response.functionCalls ?? [];

    if (calls.length) {
      if (!modelContent?.parts?.length) {
        throw new Error("Model requested tools without content");
      }
      // Pass model parts through unchanged (includes thoughtSignature).
      contents.push({
        role: "model",
        parts: modelContent.parts,
      });
      contents.push({
        role: "user",
        parts: await runToolCalls(calls),
      });
      continue;
    }

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Empty model response after tools");
    }
    yield text;
    return;
  }

  throw new Error("Too many tool rounds");
}

/**
 * Stream Gemini function-calling answers over shared portfolio tools.
 * Tries generation models in order until one works.
 */
export async function* streamAnswerWithPortfolioTools(input: {
  apiKey: string;
  question: string;
}): AsyncGenerator<string> {
  let lastError: unknown;

  for (const modelName of CHAT_GENERATION_MODELS) {
    let startedStreaming = false;
    try {
      console.info(`[chat] model=${modelName}`);
      for await (const token of streamWithToolsOnModel({
        apiKey: input.apiKey,
        modelName,
        question: input.question,
      })) {
        startedStreaming = true;
        yield token;
      }
      return;
    } catch (error) {
      lastError = error;
      if (startedStreaming || !isRetryableModelError(error)) {
        throw error;
      }
      console.warn(
        `[chat] model=${modelName} failed; trying next`,
        error instanceof Error ? error.message : error
      );
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("No Gemini generation model available");
}
