import { NextResponse } from "next/server";
import { z } from "zod";

import { streamPortfolioQuestion } from "@/lib/chat/answer";
import { CHAT_MAX_MESSAGE_CHARS } from "@/lib/chat/config";
import { checkChatRateLimit } from "@/lib/chat/rate-limit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const bodySchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(
      CHAT_MAX_MESSAGE_CHARS,
      `Keep questions under ${CHAT_MAX_MESSAGE_CHARS} characters`
    ),
});

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }
  return request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  const limit = checkChatRateLimit(clientKey(request));
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many questions. Please wait a moment and try again." },
      {
        status: 429,
        headers: limit.retryAfterSec
          ? { "Retry-After": String(limit.retryAfterSec) }
          : undefined,
      }
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const encoder = new TextEncoder();
  const abortSignal = request.signal;

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      const close = () => {
        if (closed) {
          return;
        }
        closed = true;
        try {
          controller.close();
        } catch {
          // Already closed by the runtime/client.
        }
      };

      const send = (payload: unknown) => {
        if (closed || abortSignal.aborted) {
          return false;
        }
        try {
          controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
          return true;
        } catch {
          closed = true;
          return false;
        }
      };

      const onAbort = () => {
        closed = true;
      };
      abortSignal.addEventListener("abort", onAbort, { once: true });

      try {
        for await (const event of streamPortfolioQuestion(parsed.data.message)) {
          if (!send(event)) {
            break;
          }
        }
      } catch (error) {
        console.error("[api/chat]", error);
        const message =
          error instanceof Error ? error.message : "Chat failed";
        const missingConfig =
          message.includes("Missing GEMINI_API_KEY") ||
          message.includes("Missing PINECONE_");
        send({
          type: "error",
          error: missingConfig
            ? "Chat is not configured on this server yet."
            : "Something went wrong answering that. Please try again.",
        });
      } finally {
        abortSignal.removeEventListener("abort", onAbort);
        close();
      }
    },
    cancel() {
      // Client disconnected; stop trying to write.
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
