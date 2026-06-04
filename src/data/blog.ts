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


import coverDeterministic from "@/assets/blog-deterministic-first.jpg";
import diagramStages from "@/assets/blog-production-ai-stages.png";
import coverRagArchitecture from "@/assets/blog-llm-rag-architecture-cover.jpg";
import diagramRagArchitecture from "@/assets/blog-llm-rag-architecture-diagram.png";

export const posts: BlogPost[] = [
  {
    slug: "ai-system-architecture-llm-rag-production",
    title: "AI System Architecture for LLM + RAG-Based Applications",
    excerpt:
      "Most LLM applications fail in production because of weak system architecture, not weak models. A layered pipeline for reliable, scalable RAG systems.",
    category: "AI Architecture",
    tags: ["RAG", "Architecture", "Production Systems", "LLM"],
    date: "2026-06-04",
    readingMinutes: 7,
    cover: coverRagArchitecture,
    content: `Most LLM-based applications fail in production not because of model limitations, but because of weak system architecture.

When LLMs are connected directly to raw data without proper orchestration, retrieval, and validation layers, the system becomes unreliable, inconsistent, and difficult to scale.

> A production-grade AI system is not an LLM integration. It is a structured architecture where retrieval, reasoning, and validation are clearly separated.

To solve this, modern AI systems must be designed as **structured pipelines** rather than single-model solutions.

## System Overview

This architecture is built as a multi-layer pipeline that separates responsibilities across clearly defined components.

![AI System Architecture for LLM + RAG-Based Applications](${diagramRagArchitecture})

Each layer has a single job. Each layer is independently observable, testable, and replaceable.

## 1. Request Layer

External users or systems interact with the application through API requests. This is the entry boundary — nothing downstream trusts input that has not passed through it.

## 2. API Gateway / Backend Layer

This layer manages the operational concerns that protect the rest of the system:

- Authentication
- Rate limiting
- Request validation
- Secure routing into the system

Without this layer, every downstream component has to re-implement the same defenses.

## 3. Workflow Orchestrator

The orchestrator controls execution flow. It is code, not an LLM decision:

- Detecting user intent
- Selecting the appropriate processing pipeline
- Coordinating downstream components

Control flow belongs to the orchestrator. The LLM chooses tools, never the graph.

## 4. RAG Pipeline (Context Layer)

This layer ensures the model is grounded in relevant information. It includes:

- Document ingestion
- Chunking and embedding generation
- Storage in vector databases (Pinecone, Weaviate, Milvus)
- Semantic retrieval of relevant context

The LLM never operates on raw inputs. It operates on retrieved, scoped, validated context.

## 5. LLM Layer

The LLM (GPT, Claude, Llama) is responsible for reasoning and generation. A prompt engineering layer ensures instructions are structured, consistent, and aligned with system requirements.

:::callout info|Design Principle
The LLM is one component inside a deterministic system, not the system itself. Schema-validated input. Schema-validated output. Bounded scope.
:::

## 6. Validation Layer

Before output is delivered, it is validated through:

- JSON / schema enforcement
- Output structure checks
- Hallucination risk filtering against retrieved context

This layer is where production safety is won. Reject early, retry deterministically, escalate when needed.

## 7. Output Layer

The final output is delivered through:

- API responses
- User interfaces
- Automation systems (webhooks, external workflows)

Every output carries provenance — which retrieval, which prompt, which validator passed it.

## Key Design Principles

:::callout info|Architecture Rules
- Separation of retrieval and generation
- Structured, schema-driven outputs
- Modular system design for flexibility
- Controlled LLM behavior instead of free-form output
- Scalability and production readiness
:::

## Why This Architecture Matters

By separating responsibilities across layers, the system becomes:

- More reliable in real-world use
- Easier to scale and maintain
- Less prone to hallucination
- Adaptable across multiple AI use cases

This design fits applications such as internal AI assistants, document intelligence systems, workflow automation tools, and enterprise knowledge systems.

## Conclusion

A production-grade AI system is not just an LLM integration. It is a structured architecture where retrieval, reasoning, and validation are clearly separated.

That separation is what produces predictable behavior, better performance, and long-term scalability. The teams that internalize it ship systems that hold up. The teams that do not keep rebuilding the same demo.`,
  },
  {
    slug: "llm-only-fails-engineering-extraction-what-works",
    title: "Why LLM-Only Approaches Fail in Engineering Document Extraction — And What Works Instead",
    excerpt:
      "Building production-grade document intelligence systems requires more than connecting an LLM to a PDF. A deterministic-first architecture for engineering documents.",
    category: "AI Architecture",
    tags: ["Production Systems", "Document AI", "Architecture", "Reliability"],
    date: "2026-06-04",
    readingMinutes: 8,
    featured: true,
    cover: coverDeterministic,
    content: `Most engineering teams approach document extraction the same way: connect an LLM to a PDF parser, write a prompt, ship a demo. It works on the first ten documents. It fails on the next ten thousand.

The failure is not the model. It is the architecture around it.

> Production document intelligence is not a prompting problem. It is a systems problem.

## The Core Problem: Documents Are Not Text

Engineering documents — HVAC blueprints, electrical schematics, mechanical drawings, CAD exports — are **geometric and relational systems**. They encode meaning through position, scale, layering, and symbolic convention. Flattening them to text or images for an LLM throws that meaning away.

What the model receives is a lossy projection of the real document. What we then ask it to do is reconstruct, by inference, the structure that was deleted before it ever saw the file. That is not extraction. That is guessing.

## Why LLM-Only Pipelines Fail

The failure modes are not random. They are consequences of asking a probabilistic language model to operate on structurally precise engineering data.

:::callout warn|Common Failure Modes
- Misinterpreted spatial relationships — unrelated ducts connected, walls merged across rooms
- Loss of scale and coordinate integrity between pages
- Inconsistent entity classification across visually similar drawings
- Non-reproducible outputs between runs of the same document
- OCR ambiguity amplified into structural errors downstream
- Silent hallucinations on missing components — the model invents what it expects to see
:::

These are not prompt-engineering bugs. They are inherent to a single-stage pipeline where the LLM is asked to be parser, classifier, validator, and structurer at once.

## Deterministic-First Architecture

The fix is to invert the pipeline. Instead of letting a language model interpret raw geometry, **extract structure deterministically first** and let the model reason over a clean, validated representation.

![Deterministic-first document intelligence pipeline](${diagramStages})

The same principle applies across every production AI system I have built: structure first, models second. Reliability comes from the architecture, not the weights.

## 1. Deterministic Extraction Layer

No interpretation happens at this stage. The goal is faithful capture of what the document actually contains.

- PDF structure parsing — separate vector geometry from raster content
- CAD extraction — DWG / DXF layers, blocks, and entity tables
- Targeted OCR — applied only to regions that genuinely require it

The output is raw but **complete and lossless**. Nothing is inferred yet.

## 2. Structural Decomposition Layer

Raw fragments are grouped into meaningful units using deterministic rules:

- Zones and spatial regions
- System-level segmentation (HVAC networks, electrical circuits)
- Repeated component detection via geometric similarity
- Adjacency and connectivity graphs

At this point the document is no longer a visual artifact. It is a **structured system model**.

## 3. Schema-Based Representation Layer

Entities are formalized against strict schemas, every field validated and traceable to the source geometry that produced it.

- Ducts become typed flow paths with start, end, and dimensions
- Equipment becomes labeled system nodes
- Annotations become anchored references
- Dimensions become validated, unit-checked measurements

This is where reproducibility and auditability are won. If a downstream consumer asks "where did this value come from?", the system can point to the exact polyline on the exact page.

## 4. Controlled LLM Integration

Only now does the language model enter the pipeline. It never sees a raw PDF or CAD file. It operates strictly on structured data, scoped to narrow tasks:

- Resolving ambiguous labels
- Classifying equipment types from constrained vocabularies
- Handling edge cases the rule-based layers explicitly defer

:::callout info|Production Design Principle
The LLM is a **controlled reasoning component inside a deterministic system**, not the system itself. Schema-validated input. Schema-validated output. Bounded scope. Replayable inputs. Observable outputs. If you cannot describe what the model is allowed to do in one sentence, the scope is too wide.
:::

## 5. Production Outputs

The final stage produces artifacts that downstream engineering workflows actually consume:

- CSV and Excel for estimation and bill-of-materials
- JSON for APIs, databases, and integration layers
- BIM-compatible structured datasets

Every output carries provenance metadata — source page, source geometry, extraction stage, validation status. Nothing is opaque.

## Conclusion

LLM-only extraction fails not because the models are weak, but because they are being asked to do work that should never have reached them. The discipline is to **reduce ambiguity before the model is involved**, treat the LLM as a narrow reasoning layer, and build the rest of the system to be deterministic, observable, and maintainable.

Production AI is an architecture problem. The teams that internalize that ship systems that hold up. The teams that do not keep rebuilding the same demo.`,
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
