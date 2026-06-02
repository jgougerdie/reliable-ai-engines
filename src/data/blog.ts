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
  cover?: string;
  content: string; // markdown-ish plain text rendered as paragraphs
};

import coverEngineering from "@/assets/blog-engineering-extraction.jpg";

export const posts: BlogPost[] = [
  {
    slug: "why-llm-only-fails-engineering-document-extraction",
    title: "Why LLM-Only Approaches Fail in Engineering Document Extraction — and What Works Instead",
    excerpt:
      "HVAC blueprints and CAD files are geometric systems, not text. Why end-to-end LLM extraction collapses in production, and the deterministic-first architecture that actually holds up.",
    category: "AI Architecture",
    tags: ["CAD", "HVAC", "Extraction", "Architecture"],
    date: "2025-05-20",
    readingMinutes: 8,
    featured: true,
    cover: coverEngineering,
    content: `Engineering teams working with complex documents — HVAC blueprints, architectural drawings, CAD files — often reach for large language models as end-to-end extraction systems. Upload a PDF, ask the model to return structured data, ship it. In a demo, it works. In production, it consistently breaks.

The issue is not the capability of the model. It is the mismatch between a **probabilistic language model** and **structurally precise engineering data**.

## Documents Are Not Text

HVAC blueprints and CAD files are fundamentally **geometric and relational systems**, not linear text documents. They contain:

- Vector geometry — lines, arcs, polylines
- Layered organizational structures
- Spatial relationships — adjacency, distance, alignment
- Symbolic representations — ducts, fittings, equipment
- Embedded annotations and measurements

When these files are flattened to text or images for LLM ingestion, the structural truth of the document is destroyed. What remains is a lossy projection — and the model is asked to reconstruct what was thrown away. The result is hallucinations, inconsistent parsing, and unstable outputs.

## Why LLM-Only Pipelines Fail

LLMs are optimized for reasoning over language, not geometry or deterministic structure. The common failure modes are predictable:

- Misinterpretation of spatial relationships — connecting unrelated ducts
- Loss of scale and coordinate integrity
- Inconsistent entity classification across similar drawings
- Non-reproducible outputs between runs
- Hidden ambiguity amplification — small OCR errors cascade into structural errors

LLMs "understand language." HVAC systems are not language. They are structured engineering graphs.

## The Correct Approach: Deterministic-First Architecture

The fix is to reverse the pipeline. Instead of:

\`\`\`
Document → LLM → Structured Output
\`\`\`

Do this:

\`\`\`
Document → Deterministic Extraction → Structured Model → Controlled LLM Reasoning → Output
\`\`\`

Each stage has a job. The LLM is the last one to touch the data, not the first.

## 1. Deterministic Extraction Layer

No interpretation happens early. This stage produces a raw but structured representation of every visible component:

- PDF structure parsing — text vs vector separation
- CAD extraction — DWG/DXF geometry, layers, blocks
- Targeted OCR only where strictly necessary

## 2. Structural Decomposition Layer

Raw fragments are organized into meaningful groups:

- Zones and spatial regions
- System-level segmentation — HVAC networks
- Repeated component detection
- Spatial relationship mapping

The file becomes a **structured system model**, not a visual artifact.

## 3. Schema-Based Representation Layer

Entities are formalized against strict schemas with traceability back to source geometry:

- Ducts → structured flow paths
- Equipment → labeled system nodes
- Annotations → anchored references
- Dimensions → validated measurements

This is where consistency, auditability, and reproducibility are won.

## 4. Controlled LLM Integration

Only now does the LLM enter — and it never sees a raw PDF or CAD file. It operates strictly on structured data, for narrow tasks:

- Ambiguity resolution
- Semantic classification
- Edge-case interpretation

Constraints are absolute:

- No raw PDF or CAD input
- Schema-validated input and output only
- Task-specific, isolated reasoning

The LLM becomes a **controlled reasoning component inside a deterministic system**, not the system itself.

## 5. Output Layer for Engineering Systems

Final outputs are built for real workflows:

- CSV / Excel for estimation
- JSON for APIs and databases
- BIM-compatible structured datasets

Every output is traceable, reproducible, and validation-ready.

## Key Insight

Success in engineering document AI does not come from stronger prompts. It comes from **reducing ambiguity before the model is ever involved**.

## Conclusion

LLM-based document extraction fails when it is asked to interpret structure that should already be known. Treat LLMs as **secondary reasoning tools**, not primary extraction engines. Separate deterministic extraction, structural modeling, and controlled semantic reasoning — and you get systems that are not only accurate, but stable enough for production engineering environments.`,
  },
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
    content: `In this tutorial we build a self-correcting LangGraph agent. The producer node generates a candidate; the critic node validates it against a schema and rubric; the controller decides whether to accept, retry, or escalate. By the end you will have a working graph you can adapt to extraction, code generation, or any task where "wrong but confident" is the failure mode you need to eliminate.

## What we're building

A three-node graph:

- **Producer** — calls an LLM to generate a structured candidate answer.
- **Critic** — validates the candidate against a Pydantic schema and a rubric, returning either \`accept\` or a list of issues.
- **Controller** — routes the next step: accept and finish, retry with the critique appended to the prompt, or escalate to a stronger model after the retry budget is exhausted.

The state object is the single source of truth. Every node is a pure function of state.

## 1. Install and set up

\`\`\`bash
pip install langgraph langchain-openai pydantic
export OPENAI_API_KEY=sk-...
\`\`\`

## 2. Define the state

State is explicit, typed, and replayable. Avoid hidden globals.

\`\`\`python
from typing import TypedDict, Optional, List
from pydantic import BaseModel, Field

class Invoice(BaseModel):
    vendor: str = Field(min_length=1)
    total_cents: int = Field(ge=0)
    currency: str = Field(pattern=r"^[A-Z]{3}$")
    line_items: list[str]

class GraphState(TypedDict):
    raw_text: str
    candidate: Optional[Invoice]
    issues: List[str]
    attempts: int
    final: Optional[Invoice]
    escalated: bool
\`\`\`

## 3. Producer node

Use structured outputs so the model returns parseable JSON. Append prior critique on retries — this is what makes the loop self-correcting.

\`\`\`python
from langchain_openai import ChatOpenAI

producer_llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

def producer(state: GraphState) -> GraphState:
    critique = ""
    if state["issues"]:
        critique = "\\n\\nPrevious attempt had these issues — fix them:\\n- " + "\\n- ".join(state["issues"])
    prompt = f"Extract an invoice from:\\n\\n{state['raw_text']}{critique}"
    candidate = producer_llm.with_structured_output(Invoice).invoke(prompt)
    return {**state, "candidate": candidate, "attempts": state["attempts"] + 1}
\`\`\`

## 4. Critic node

Cheaper than the producer. Returns concrete, actionable issues — not vibes.

\`\`\`python
critic_llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

class Critique(BaseModel):
    accept: bool
    issues: list[str]

def critic(state: GraphState) -> GraphState:
    cand = state["candidate"]
    if cand is None:
        return {**state, "issues": ["No candidate produced"]}
    rubric = (
        "Reject if: vendor looks like a person name, total_cents is missing decimals,"
        " currency is not ISO-4217, or line_items is empty."
    )
    msg = f"Rubric:\\n{rubric}\\n\\nCandidate:\\n{cand.model_dump_json()}"
    result = critic_llm.with_structured_output(Critique).invoke(msg)
    return {**state, "issues": [] if result.accept else result.issues}
\`\`\`

## 5. Controller (the routing function)

Control flow is code, not an LLM decision. This is the single most important rule for production agents.

\`\`\`python
MAX_ATTEMPTS = 2

def route(state: GraphState) -> str:
    if not state["issues"]:
        return "accept"
    if state["attempts"] >= MAX_ATTEMPTS:
        return "escalate"
    return "retry"

def accept(state: GraphState) -> GraphState:
    return {**state, "final": state["candidate"]}

escalation_llm = ChatOpenAI(model="gpt-4o", temperature=0)

def escalate(state: GraphState) -> GraphState:
    cand = escalation_llm.with_structured_output(Invoice).invoke(
        f"Extract an invoice. Previous attempts failed: {state['issues']}\\n\\n{state['raw_text']}"
    )
    return {**state, "final": cand, "escalated": True}
\`\`\`

## 6. Wire the graph

\`\`\`python
from langgraph.graph import StateGraph, END

g = StateGraph(GraphState)
g.add_node("producer", producer)
g.add_node("critic", critic)
g.add_node("accept", accept)
g.add_node("escalate", escalate)

g.set_entry_point("producer")
g.add_edge("producer", "critic")
g.add_conditional_edges("critic", route, {
    "accept": "accept",
    "retry": "producer",
    "escalate": "escalate",
})
g.add_edge("accept", END)
g.add_edge("escalate", END)

app = g.compile()
\`\`\`

## 7. Run it

\`\`\`python
result = app.invoke({
    "raw_text": "ACME Logistics LLC — Invoice #4421 — Total: $1,204.50 USD — Items: pallet wrap, freight",
    "candidate": None,
    "issues": [],
    "attempts": 0,
    "final": None,
    "escalated": False,
})
print(result["final"], "escalated:", result["escalated"], "attempts:", result["attempts"])
\`\`\`

## What you just built

Four properties that separate this from a demo:

1. **Replayable** — the entire state object is serializable. Persist it and you can replay any failed run.
2. **Bounded** — the retry budget caps both cost and latency. No infinite loops.
3. **Self-correcting** — critique flows back into the producer prompt instead of being thrown away.
4. **Cost-aware** — small model does the producer/critic work; the frontier model is reserved for escalation.

## Where to take it next

- Add a **golden eval set** and run the graph against it on every change. Without eval you cannot tell whether a prompt edit helped.
- Emit traces to LangSmith or OpenTelemetry — every node transition, every token count, every retry reason.
- Replace the rubric-based critic with a **deterministic validator** wherever possible (regex, schema, business rules). LLM critics are a fallback, not a default.
- Swap the producer for a tool-calling agent when extraction isn't enough and the model actually needs to query systems.

The architecture stays the same. That's the point.`,
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
