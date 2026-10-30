import { streamAnswerWithPortfolioTools } from "@/lib/chat/gemini";
import { requireChatEnv } from "@/lib/chat/config";
import {
  resolveChatSources,
  type ChatSource,
} from "@/lib/chat/sources";

export type { ChatSource };

export type ChatStreamEvent =
  | { type: "status"; stage: "searching" | "writing" }
  | { type: "sources"; sources: ChatSource[] }
  | { type: "token"; text: string }
  | { type: "done" };

function msSince(start: number): number {
  return Math.round(performance.now() - start);
}

/**
 * Site chat: Gemini function calling over shared portfolio tools
 * (stats, projects, notes, semantic search_notes), with streamed tokens.
 */
export async function* streamPortfolioQuestion(
  question: string
): AsyncGenerator<ChatStreamEvent> {
  const totalStart = performance.now();
  const { geminiApiKey } = requireChatEnv();

  yield { type: "status", stage: "searching" };

  const answerStart = performance.now();
  let answer = "";
  let startedWriting = false;

  for await (const token of streamAnswerWithPortfolioTools({
    apiKey: geminiApiKey,
    question,
  })) {
    if (!startedWriting) {
      startedWriting = true;
      console.info(`[chat] path=tools firstToken=${msSince(answerStart)}ms`);
      yield { type: "status", stage: "writing" };
    }
    answer += token;
    yield { type: "token", text: token };
  }

  console.info(`[chat] path=tools answer=${msSince(answerStart)}ms`);

  yield {
    type: "sources",
    sources: await resolveChatSources(answer),
  };

  console.info(`[chat] total=${msSince(totalStart)}ms`);
  yield { type: "done" };
}
