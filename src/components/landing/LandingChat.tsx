"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { Send } from "lucide-react";
import { useEffect, useRef } from "react";

import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputProvider,
  PromptInputSubmit,
  PromptInputTextarea,
  usePromptInputController,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { cn } from "@/lib/utils";

const SUGGESTED = [
  "What services do you offer?",
  "Show me a RAG case study.",
  "Can you build a multi-agent system for sales?",
  "How does an engagement work?",
];

export function LandingChat() {
  return (
    <PromptInputProvider>
      <LandingChatInner />
    </PromptInputProvider>
  );
}

function LandingChatInner() {
  const transport = useRef(new DefaultChatTransport({ api: "/api/chat" })).current;
  const { messages, sendMessage, status, error } = useChat({
    id: "landing-chat",
    transport,
  });
  const controller = usePromptInputController();

  const busy = status === "submitted" || status === "streaming";
  const canSubmit = controller.textInput.value.trim().length > 0 && !busy;

  async function handleSubmit({ text }: { text: string }) {
    const t = text.trim();
    if (!t || busy) return;
    await sendMessage({ text: t });
  }

  function submit(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    controller.textInput.clear();
    sendMessage({ text: t });
  }

  return (
    <div className="relative w-full max-w-xl" style={{ perspective: "1200px" }}>
      {/* Background 3D motion objects */}
      <div
        aria-hidden
        className="animate-float-3d pointer-events-none absolute -left-8 top-1/4 h-32 w-32 rounded-full bg-[var(--brand)]/15 blur-3xl"
      />
      <div
        aria-hidden
        className="animate-float-3d-delayed pointer-events-none absolute -right-12 bottom-1/4 h-48 w-48 rounded-full bg-[var(--brand-violet)]/10 blur-[80px]"
      />

      {/* 3D holographic card */}
      <div
        className={cn(
          "chat-card-3d relative flex h-[560px] w-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-[0_20px_80px_-20px_rgba(106,168,255,0.35)] backdrop-blur-2xl",
          "before:pointer-events-none before:absolute before:inset-0 before:bg-gradient-to-tr before:from-white/[0.02] before:to-white/[0.08]"
        )}
      >
        {/* Floating 3D icon overlay */}
        <div
          className="chat-layer-high animate-float pointer-events-none absolute -left-5 -top-5 z-20 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-violet)] shadow-[0_10px_30px_-10px_rgba(106,168,255,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)]"
        >
          <ArchitectIcon className="h-7 w-7 text-white" />
        </div>

        {/* Header */}
        <div className="chat-layer-high flex items-center justify-between border-b border-white/10 px-5 py-3">
          <div className="flex items-center gap-3">
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-violet)] shadow-[0_0_20px_-4px_var(--brand)]">
              <ArchitectIcon className="h-4 w-4 text-white" />
              <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-[#05070d]" />
            </span>
            <div className="leading-tight">
              <p className="text-3d-motion text-sm font-semibold text-white">
                Ask the Architect
              </p>
              <p className="text-[11px] text-[var(--brand)]/70">On-site AI · services & case studies</p>
            </div>
          </div>
          <span className="hidden text-[10px] uppercase tracking-[0.25em] text-white/40 sm:block">
            Live
          </span>
        </div>

        {/* Conversation */}
        <Conversation className="flex-1 px-5 py-4">
          <ConversationContent className="gap-4">
            {messages.length === 0 ? (
              <ConversationEmptyState className="h-full">
                <EmptyState onPick={submit} />
              </ConversationEmptyState>
            ) : (
              messages.map((m) => <ChatMessage key={m.id} message={m} />)
            )}
            {busy && (
              <div className="chat-layer-mid flex items-center gap-3 py-1">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-delay:0ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white/50 [animation-delay:300ms]" />
                </div>
                <Shimmer as="span" className="text-xs text-white/50">
                  Architect is thinking
                </Shimmer>
              </div>
            )}
            {error && (
              <div className="mt-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-200">
                {error.message.includes("402")
                  ? "AI credits are exhausted — please try again later."
                  : error.message.includes("429")
                    ? "Rate limit hit. Give it a moment and try again."
                    : "Something went wrong. Try again."}
              </div>
            )}
          </ConversationContent>
        </Conversation>

        {/* Composer */}
        <div className="chat-layer-high border-t border-white/10 bg-black/20 p-3">
          <PromptInput
            onSubmit={handleSubmit}
            className="relative"
          >
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--brand-violet)] opacity-20 blur-sm transition-opacity duration-500 group-focus-within/input-group:opacity-40" />
            <PromptInputTextarea
              placeholder="Ask about services, case studies, or engagement…"
              className="relative min-h-[42px] max-h-32 flex-1 resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-[var(--brand)]/50 focus:outline-none focus:ring-1 focus:ring-[var(--brand)]/40"
            />
            <PromptInputFooter className="justify-end pt-2">
              <PromptInputSubmit
                status={status}
                disabled={!canSubmit}
                className="inline-flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand)] to-[var(--brand-violet)] text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </PromptInputSubmit>
            </PromptInputFooter>
          </PromptInput>
        </div>

        {/* Bottom inner glow */}
        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[var(--brand)]/10 to-transparent rounded-b-3xl" />
      </div>

      {/* 3D shadow/reflection plane */}
      <div
        className="chat-layer-low pointer-events-none absolute -bottom-6 left-1/2 h-4 w-[90%] -translate-x-1/2 rounded-[100%] bg-[var(--brand)]/20 blur-xl"
      />
    </div>
  );
}

function ChatMessage({ message }: { message: UIMessage }) {
  const text = message.parts
    .map((p) => (p.type === "text" ? p.text : ""))
    .join("");
  const isUser = message.role === "user";

  return (
    <Message
      from={message.role}
      className={cn(
        "max-w-[95%]",
        isUser ? "ml-auto items-end" : "items-start"
      )}
    >
      <MessageContent
        className={cn(
          "chat-layer-mid text-sm shadow-md",
          isUser
            ? "max-w-[85%] bg-gradient-to-br from-[var(--brand)] to-[var(--brand-violet)] px-4 py-2.5 text-white [border:0] rounded-2xl rounded-br-sm"
            : "max-w-[85%] rounded-2xl rounded-tl-none border border-white/10 bg-white/10 px-4 py-2.5 text-white/90"
        )}
      >
        <MessageResponse>{text}</MessageResponse>
      </MessageContent>
    </Message>
  );
}

function EmptyState({ onPick }: { onPick: (t: string) => void }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <div className="chat-layer-mid mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--brand)]/20 to-[var(--brand-violet)]/20 ring-1 ring-white/10">
        <ArchitectIcon className="h-5 w-5 text-white/70" />
      </div>
      <h3 className="text-3d-motion text-lg font-medium text-white">How can I help?</h3>
      <p className="mt-1 max-w-sm text-sm text-white/50">
        Ask about the services offered or a past project — I&apos;ll answer from the real portfolio.
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

function ArchitectIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 3v18" />
      <path d="M4 7h16" />
      <path d="M6 12h12" />
      <path d="M8 17h8" />
      <circle cx="12" cy="7" r="2" />
      <circle cx="8" cy="12" r="1.5" />
      <circle cx="16" cy="12" r="1.5" />
      <circle cx="10" cy="17" r="1" />
      <circle cx="14" cy="17" r="1" />
    </svg>
  );
}
