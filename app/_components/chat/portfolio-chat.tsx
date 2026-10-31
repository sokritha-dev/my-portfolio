"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { MessageCircle, X } from "lucide-react";

import { SourceLinkCard } from "@/app/_components/chat/source-link-card";
import {
  simplifyAnswerForSources,
  type ChatSource,
} from "@/lib/chat/sources";

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
};

type StreamEvent =
  | { type: "status"; stage: "searching" | "writing" }
  | { type: "sources"; sources: ChatSource[] }
  | { type: "token"; text: string }
  | { type: "done" }
  | { type: "error"; error: string };

/** Adaptive typewriter: steadier than raw Gemini chunk sizes. */
function charsToReveal(backlog: number): number {
  if (backlog > 120) {
    return 10;
  }
  if (backlog > 60) {
    return 5;
  }
  if (backlog > 24) {
    return 3;
  }
  return 1;
}

function tickDelayMs(backlog: number): number {
  if (backlog > 80) {
    return 10;
  }
  if (backlog > 30) {
    return 14;
  }
  return 22;
}

export function PortfolioChat() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState<"searching" | "writing" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "I'm an AI Assistant that answers from this portfolio only — notes, projects, and background.",
    },
  ]);
  const listRef = useRef<HTMLDivElement>(null);
  const revealBufferRef = useRef("");
  const revealedRef = useRef("");
  const revealTimerRef = useRef<number | null>(null);
  const streamDoneRef = useRef(false);
  const activeAssistantIdRef = useRef<string | null>(null);

  function scrollToBottom(smooth: boolean) {
    const list = listRef.current;
    if (!list) {
      return;
    }
    list.scrollTo({
      top: list.scrollHeight,
      behavior: smooth ? "smooth" : "auto",
    });
  }

  function stopReveal() {
    if (revealTimerRef.current != null) {
      window.clearTimeout(revealTimerRef.current);
      revealTimerRef.current = null;
    }
  }

  function finishIfIdle() {
    if (!streamDoneRef.current || revealBufferRef.current.length > 0) {
      return;
    }
    stopReveal();
    setPending(false);
    setStatus(null);
    scrollToBottom(true);
  }

  function scheduleReveal(assistantId: string) {
    if (revealTimerRef.current != null) {
      return;
    }

    const tick = () => {
      const backlog = revealBufferRef.current;
      if (!backlog) {
        revealTimerRef.current = null;
        finishIfIdle();
        return;
      }

      const take = Math.min(backlog.length, charsToReveal(backlog.length));
      const chunk = backlog.slice(0, take);
      revealBufferRef.current = backlog.slice(take);
      revealedRef.current += chunk;

      setMessages((current) =>
        current.map((item) =>
          item.id === assistantId
            ? { ...item, content: revealedRef.current }
            : item
        )
      );
      scrollToBottom(false);

      revealTimerRef.current = window.setTimeout(
        tick,
        tickDelayMs(revealBufferRef.current.length)
      );
    };

    revealTimerRef.current = window.setTimeout(tick, 16);
  }

  useEffect(() => {
    if (!open) {
      return;
    }
    scrollToBottom(false);
  }, [open]);

  useEffect(() => {
    return () => stopReveal();
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const message = input.trim();
    if (!message || pending) {
      return;
    }

    const assistantId = `assistant-${Date.now()}`;
    activeAssistantIdRef.current = assistantId;
    revealBufferRef.current = "";
    revealedRef.current = "";
    streamDoneRef.current = false;
    stopReveal();

    setInput("");
    setError(null);
    setStatus("searching");
    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, role: "user", content: message },
      { id: assistantId, role: "assistant", content: "" },
    ]);
    setPending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok || !response.body) {
        const data = (await response.json().catch(() => null)) as {
          error?: string;
        } | null;
        throw new Error(data?.error || "Request failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) {
            continue;
          }

          const event = JSON.parse(line) as StreamEvent;

          if (event.type === "error") {
            throw new Error(event.error);
          }

          if (event.type === "status") {
            setStatus(event.stage);
            continue;
          }

          if (event.type === "sources") {
            const fullText = `${revealedRef.current}${revealBufferRef.current}`;
            const cleaned = simplifyAnswerForSources(fullText, event.sources);
            revealBufferRef.current = "";
            revealedRef.current = cleaned;
            setMessages((current) =>
              current.map((item) =>
                item.id === assistantId
                  ? {
                      ...item,
                      content: cleaned,
                      sources: event.sources,
                    }
                  : item
              )
            );
            continue;
          }

          if (event.type === "token") {
            setStatus(null);
            revealBufferRef.current += event.text;
            scheduleReveal(assistantId);
          }
        }
      }

      streamDoneRef.current = true;
      if (!revealedRef.current && !revealBufferRef.current) {
        setMessages((current) =>
          current.map((item) =>
            item.id === assistantId
              ? {
                  ...item,
                  content: "I could not find an answer in this portfolio.",
                }
              : item
          )
        );
        setPending(false);
        setStatus(null);
        return;
      }

      scheduleReveal(assistantId);
      finishIfIdle();
    } catch (submitError) {
      stopReveal();
      streamDoneRef.current = true;
      const messageText =
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong.";
      setError(messageText);
      setMessages((current) =>
        current.filter(
          (item) => item.id !== assistantId || item.content.trim()
        )
      );
      setPending(false);
      setStatus(null);
    }
  }

  const streamingAssistantId = pending ? activeAssistantIdRef.current : null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {open ? (
        <section
          aria-label="Portfolio chat"
          className="flex h-[min(32rem,70vh)] w-[min(24rem,calc(100vw-2rem))] flex-col border border-[hsl(var(--hairline))] bg-background shadow-sm"
        >
          <header className="flex items-center justify-between border-b border-[hsl(var(--hairline))] px-4 py-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-[hsl(var(--label-gold))]">
                Ask the portfolio
              </p>
              <p className="mt-0.5 text-sm text-foreground">
                AI answers from notes & about
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Close chat"
            >
              <X className="h-4 w-4" />
            </button>
          </header>

          <div
            ref={listRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3"
          >
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user" ? "ml-6 text-right" : "mr-4 text-left"
                }
              >
                {message.content ? (
                  <p
                    className={`inline-block whitespace-pre-wrap text-left text-[13px] leading-6 ${
                      message.role === "user"
                        ? "bg-[hsl(var(--muted))] px-3 py-2 text-foreground"
                        : "text-foreground/90"
                    }`}
                  >
                    {message.content}
                    {streamingAssistantId === message.id ? (
                      <span
                        aria-hidden
                        className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] bg-foreground/70 align-baseline animate-pulse"
                      />
                    ) : null}
                  </p>
                ) : pending && message.role === "assistant" ? (
                  <p className="text-[12px] text-muted-foreground">
                    {status === "searching"
                      ? "Searching notes…"
                      : "Writing answer…"}
                  </p>
                ) : null}
                {message.sources && message.sources.length > 0 ? (
                  <ul className="mt-2.5 space-y-2 text-left">
                    {message.sources.map((source) => (
                      <li key={source.url}>
                        <SourceLinkCard source={source} />
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
            {error ? (
              <p className="text-[12px] text-red-700" role="alert">
                {error}
              </p>
            ) : null}
          </div>

          <form
            onSubmit={onSubmit}
            className="border-t border-[hsl(var(--hairline))] p-3"
          >
            <label className="sr-only" htmlFor="portfolio-chat-input">
              Your question
            </label>
            <div className="flex gap-2">
              <input
                id="portfolio-chat-input"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask a question…"
                maxLength={1000}
                disabled={pending}
                className="min-w-0 flex-1 border border-[hsl(var(--hairline))] bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground/70 focus:border-foreground/40"
              />
              <button
                type="submit"
                disabled={pending || !input.trim()}
                className="shrink-0 border border-foreground bg-foreground px-3 py-2 text-xs font-medium uppercase tracking-[0.08em] text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </form>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="inline-flex items-center gap-2 border border-foreground bg-foreground px-4 py-2.5 text-xs font-medium uppercase tracking-[0.1em] text-background transition-opacity hover:opacity-90"
        aria-expanded={open}
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        {open ? "Close" : "Ask AI"}
      </button>
    </div>
  );
}
