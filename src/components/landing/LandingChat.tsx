import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { Send, Sparkles } from "lucide-react";

const SUGGESTED = [
  "What services do you offer?",
  "Show me a RAG case study.",
  "Can you build a multi-agent system for sales?",
  "How does an engagement work?",
];

export function LandingChat() {
  const [input, setInput] = useState("");
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;

  const { messages, sendMessage, status, error } = useChat({
    id: "landing-chat",
    transport,
  });

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  useEffect(() => {
    if (status === "ready") inputRef.current?.focus();
  }, [status]);

  const busy = status === "submitted" || status === "streaming";

  async function submit(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    setInput("");
    await sendMessage({ text: t });
  }

  return (
    <div className="relative flex h-[560px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] shadow-[0_20px_80px_-20px_rgba(106,168,255,0.35)] backdrop-blur-xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand)] to-[var(--brand-violet)]">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#05070d]" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-medium text-white">Ask the Architect</p>
            <p className="text-[11px] text-white/50">On-site AI · services & case studies</p>
          </div>
        </div>
        <span className="hidden text-[10px] uppercase tracking-[0.25em] text-white/40 sm:block">
          Live
        </span>
      </div>

      {/* Transcript */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5">
        {messages.length === 0 ? (
          <EmptyState onPick={submit} />
        ) : (
          <div className="flex flex-col gap-4">
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {status === "submitted" && <TypingIndicator />}
          </div>
        )}
        {error && (
          <div className="mt-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
            {error.message.includes("402")
              ? "AI credits are exhausted — please try again later."
              : error.message.includes("429")
                ? "Rate limit hit. Give it a moment and try again."
                : "Something went wrong. Try again."}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit(input);
        }}
        className="border-t border-white/10 bg-black/20 p-3"
      >
        <div className="flex items-end gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(input);
              }
            }}
            placeholder="Ask about services, case studies, or engagement…"
            rows={1}
            className="min-h-[42px] max-h-32 flex-1 resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[var(--brand)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--brand)]/40"
          />
          <button
            type="submit"
            disabled={busy || !input.trim()}
            className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand)] to-[var(--brand-violet)] text-white shadow-lg transition disabled:cursor-not-allowed disabled:opacity-40 hover:opacity-90"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </form>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)]/20 to-[var(--brand-violet)]/20 ring-1 ring-white/10">
        <Sparkles className="h-5 w-5 text-white/70" />
      </div>
      <h3 className="text-lg font-medium text-white">How can I help?</h3>
      <p className="mt-1 max-w-sm text-sm text-white/50">
        Ask about the services offered or a past project — I'll answer from the real portfolio.
      </p>
      <div className="mt-6 grid w-full max-w-md grid-cols-1 gap-2 sm:grid-cols-2">
        {SUGGESTED.map((s) => (
          <button
            key={s}
            onClick={() => onPick(s)}
            className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 text-left text-xs text-white/70 transition hover:border-white/25 hover:bg-white/[0.06] hover:text-white"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: UIMessage }) {
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-gradient-to-br from-[var(--brand)] to-[var(--brand-violet)] px-4 py-2.5 text-sm text-white shadow-md">
          {text}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-[var(--brand)]/30 to-[var(--brand-violet)]/30 ring-1 ring-white/10" />
      <div className="prose prose-invert prose-sm max-w-none flex-1 text-sm text-white/90 [&_a]:text-[var(--brand)] [&_a]:no-underline hover:[&_a]:underline [&_code]:rounded [&_code]:bg-white/10 [&_code]:px-1 [&_code]:py-0.5 [&_code]:text-[0.85em] [&_p]:my-2 [&_ul]:my-2 [&_li]:my-0.5">
        <ReactMarkdown>{text || "…"}</ReactMarkdown>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-3">
      <div className="mt-0.5 h-7 w-7 shrink-0 rounded-lg bg-gradient-to-br from-[var(--brand)]/30 to-[var(--brand-violet)]/30 ring-1 ring-white/10" />
      <div className="flex items-center gap-1 pt-2">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-delay:0ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-delay:150ms]" />
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-delay:300ms]" />
      </div>
    </div>
  );
}
