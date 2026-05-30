export type BlogCategory =
  | "AI Agents"
  | "RAG Systems"
  | "LLM Engineering"
  | "AI Architecture"
  | "Production AI"
  | "Case Studies"
  | "Tutorials";

export const BLOG_CATEGORIES: BlogCategory[] = [
  "AI Agents",
  "RAG Systems",
  "LLM Engineering",
  "AI Architecture",
  "Production AI",
  "Case Studies",
  "Tutorials",
];

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  tags: string[];
  date: string; // ISO
  readingMinutes: number;
  featured?: boolean;
  content: string; // markdown-ish plain text rendered as paragraphs
};

export const posts: BlogPost[] = [
  {
    slug: "designing-stateful-multi-agent-systems",
    title: "Designing Stateful Multi-Agent Systems That Actually Hold Up in Production",
    excerpt:
      "Why most agent demos collapse at scale, and the architecture patterns that keep multi-agent systems reliable, debuggable, and cost-controlled.",
    category: "AI Agents",
    tags: ["LangGraph", "Agents", "Architecture"],
    date: "2025-04-12",
    readingMinutes: 9,
    featured: true,
    content: `Multi-agent systems look magical in demos and collapse the moment they meet real-world data. The difference between a prototype and a production system is almost never the model — it's the architecture around the model.

This post breaks down the four pillars I rely on when designing multi-agent systems for clients: explicit state, deterministic orchestration, validation loops, and cost-aware routing.

Explicit state is the single most underrated design decision. Treat your agents as pure functions over a shared state object. Every transition writes to state, every read goes through state. This makes the system replayable, debuggable, and testable.

Deterministic orchestration means the graph of "which agent runs when" is code, not an LLM decision. LLMs choose tools; they don't choose control flow. Mix those up and you lose the ability to reason about behavior.

Validation loops are where reliability is won. Every agent output passes through a critique step that can reject, retry, or escalate. The critique is cheaper than the producer — that's the whole trick.

Finally, cost-aware model routing. Frontier models for hard reasoning, small models for everything else. Done correctly this is a 5–10x cost reduction with no quality loss.`,
  },
  {
    slug: "production-rag-pitfalls",
    title: "The Five RAG Pitfalls That Quietly Kill Enterprise Deployments",
    excerpt:
      "Chunking, retrieval, evaluation, access control, freshness — the five places production RAG systems silently fail and how to fix them.",
    category: "RAG Systems",
    tags: ["RAG", "Vector Search", "Evaluation"],
    date: "2025-03-28",
    readingMinutes: 11,
    featured: true,
    content: `Enterprise RAG looks deceptively simple: embed documents, search, generate. The reason most pilots never reach production is that each of those steps hides a failure mode that only surfaces at scale.

Chunking is rarely solved by the default 1000-token splitter. Semantic chunking that respects document structure typically improves retrieval quality by 20–40% with zero infra changes.

Retrieval is where teams over-rotate on vectors and under-invest in hybrid search and metadata filtering. The best retrieval stacks combine BM25, dense vectors, and structured filters, then rerank.

Evaluation is the missing layer. Without a golden set and an automated eval harness running on every change, you cannot tell whether a prompt tweak helped or hurt.

Access control matters even more in RAG than in traditional apps — the model will happily synthesize content from documents the user wasn't supposed to see. Permissions must be enforced at retrieval time, not at generation time.

Freshness is the last killer. Incremental sync, deletion handling, and embedding versioning are not optional.`,
  },
  {
    slug: "llm-cost-engineering",
    title: "LLM Cost Engineering: Getting to 10x Without Hurting Quality",
    excerpt:
      "Caching, routing, distillation, structured outputs — the disciplined practices that turn a runaway OpenAI bill into a controlled line item.",
    category: "LLM Engineering",
    tags: ["Cost", "Routing", "Caching"],
    date: "2025-03-10",
    readingMinutes: 7,
    content: `LLM bills explode for the same reason cloud bills explode: defaults are tuned for convenience, not economics. A disciplined cost program around prompt caching, model routing, and structured output design typically yields 5–10x reduction without any quality regression.`,
  },
  {
    slug: "ai-architecture-first-principles",
    title: "AI Architecture from First Principles",
    excerpt:
      "Most AI systems fail at the architecture layer, not the model layer. A framework for designing AI systems that survive contact with production.",
    category: "AI Architecture",
    tags: ["Architecture", "Design"],
    date: "2025-02-22",
    readingMinutes: 10,
    content: `Treat the LLM as one component, not the center of your system. Design the surrounding architecture — state, orchestration, validation, observability — and the model choice becomes a tunable parameter rather than a foundation.`,
  },
  {
    slug: "from-prototype-to-production",
    title: "From Prototype to Production: The AI Maturity Curve",
    excerpt:
      "What separates a wow-demo notebook from a system enterprises can rely on. The capabilities you must add before going live.",
    category: "Production AI",
    tags: ["Production", "MLOps"],
    date: "2025-02-05",
    readingMinutes: 8,
    content: `The path from prototype to production is a stack of disciplines: evaluation, observability, deployment, security, cost control, and incident response. Each one is unglamorous; together they are the difference between a demo and a system.`,
  },
  {
    slug: "case-study-logistics-document-ai",
    title: "Case Study: Document AI for a Logistics Operator",
    excerpt:
      "How a layout-aware OCR + LLM extraction pipeline cut manual processing time and unlocked operational data that had been trapped in PDFs.",
    category: "Case Studies",
    tags: ["Logistics", "OCR", "Extraction"],
    date: "2025-01-20",
    readingMinutes: 6,
    content: `A walkthrough of the architecture, evaluation strategy, and rollout plan behind a production document-intelligence platform serving a mid-market logistics operator.`,
  },
  {
    slug: "tutorial-langgraph-validation-loops",
    title: "Tutorial: Building Validation Loops in LangGraph",
    excerpt:
      "A code-first walkthrough of self-correcting agents using critique nodes, retry budgets, and structured outputs.",
    category: "Tutorials",
    tags: ["LangGraph", "Tutorial"],
    date: "2025-01-08",
    readingMinutes: 12,
    content: `In this tutorial we build a self-correcting LangGraph agent. The producer node generates a candidate; the critic node validates it against a schema and rubric; the controller decides whether to accept, retry, or escalate.`,
  },
];

export function getPost(slug: string) {
  return posts.find((p) => p.slug === slug);
}

export function listPosts(opts?: { category?: BlogCategory; query?: string }) {
  let list = [...posts].sort((a, b) => b.date.localeCompare(a.date));
  if (opts?.category) list = list.filter((p) => p.category === opts.category);
  if (opts?.query) {
    const q = opts.query.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)),
    );
  }
  return list;
}
