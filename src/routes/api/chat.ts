import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { projects } from "@/data/projects";
import { createClient } from "@supabase/supabase-js";

type VideoKnowledge = {
  title: string;
  description: string | null;
  tags: string[] | null;
  transcript: string | null;
};

async function loadVideoKnowledge(): Promise<string> {
  const url = process.env['SUPABASE_URL'];
  const key = process.env['SUPABASE_PUBLISHABLE_KEY'];
  if (!url || !key) return "";
  try {
    const client = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await client
      .from("videos")
      .select("title, description, tags, transcript")
      .eq("ai_shared", true)
      .order("created_at", { ascending: false })
      .limit(30);
    if (error || !data?.length) return "";
    return (data as VideoKnowledge[])
      .map((v) => {
        const tags = v.tags?.length ? `\n   Tags: ${v.tags.join(", ")}` : "";
        const desc = v.description ? `\n   Summary: ${v.description}` : "";
        const tx = v.transcript
          ? `\n   Transcript: ${v.transcript.slice(0, 6000)}`
          : "\n   Transcript: (none provided)";
        return `• Video: ${v.title}${desc}${tags}${tx}`;
      })
      .join("\n\n");
  } catch {
    return "";
  }
}

const SERVICES = [
  { title: "AI Architecture", desc: "End-to-end system design for production LLM, RAG, and agent platforms." },
  { title: "LLM Applications", desc: "OpenAI, Claude, Llama and bespoke LLM APIs shipped to production with evals and guardrails." },
  { title: "RAG Systems", desc: "Hybrid retrieval, re-ranking, IAM-aware filtering, grounded generation." },
  { title: "AI Agents", desc: "Deterministic LangGraph orchestration with validation nodes, retries, typed contracts." },
  { title: "Workflow Automation", desc: "Operational AI woven into real business processes: sales, ops, back-office." },
  { title: "Cloud Deployment", desc: "AWS ECS/Fargate, vector infra, observability, cost controls, runbooks." },
];

const ENGAGEMENT = `Engagement model:
- Discovery call → written architecture proposal → fixed-scope build → handover with runbook.
- Available via Upwork or direct contract. Typical projects run 4–12 weeks.
- I lead architecture and implementation personally; not an agency.`;

function systemPrompt(videoKnowledge: string) {
  const services = SERVICES.map((s) => `- ${s.title}: ${s.desc}`).join("\n");
  const portfolio = projects
    .map(
      (p) =>
        `• ${p.title} (${p.role})
   Summary: ${p.summary}
   Impact: ${p.impact}
   Stack: ${p.technologies.join(", ")}
   Slug: /portfolio/${p.slug}`,
    )
    .join("\n\n");

  return `You are the on-site AI assistant for Architect.systems, the consulting practice of a senior AI Architect specializing in production-grade LLM, RAG, and agent systems.

Your job: answer visitor questions about the services offered and the portfolio / case studies below. Be concise, direct, and technically credible. Use short paragraphs and bullet lists. Recommend booking a consultation when a project fit is clear.

Rules:
- Only answer from the material below plus general context about production AI. If asked something unrelated (weather, coding help, personal chit-chat), briefly redirect to services/portfolio.
- Never invent case studies, clients, prices, or metrics not listed here.
- When a visitor's need clearly matches a case study, name it and link the slug.
- End with a soft next step when relevant: "Book a consultation on /contact" or "See the full case study at /portfolio/<slug>".

## SERVICES
${services}

${ENGAGEMENT}

## PORTFOLIO / CASE STUDIES
${portfolio}
${
  videoKnowledge
    ? `\n## VIDEO LIBRARY (talks, demos, walkthroughs — answer from these transcripts when relevant and name the video)\n${videoKnowledge}\n`
    : ""
}`;
}

type ChatRequestBody = { messages?: unknown };

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as ChatRequestBody;
        if (!Array.isArray(messages)) {
          return new Response("Messages are required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3.5-flash"),
          system: systemPrompt(await loadVideoKnowledge()),
          messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
          originalMessages: messages as UIMessage[],
        });
      },
    },
  },
});
