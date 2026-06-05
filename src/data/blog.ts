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

// Posts are ordered to flow:
//   Foundations → Systems → Implementation → Proof
// Sort is by date desc, so the dates below encode that buyer journey.
export const posts: BlogPost[] = [
  // ──────────────────────────────────────────────────────────
  // FOUNDATIONS
  // ──────────────────────────────────────────────────────────
  {
    slug: "why-ai-projects-break-after-prototype",
    title: "Why Most AI Projects Break After the Prototype Stage",
    excerpt:
      "The demo works. The pilot ships. Six weeks later, the system is unreliable, expensive, and nobody trusts the output. Here is what actually goes wrong — and the maturity checklist that prevents it.",
    category: "Production AI",
    tags: ["Production", "Reliability", "AI Strategy"],
    date: "2026-06-05",
    readingMinutes: 9,
    featured: true,
    content: `Roughly four out of five enterprise AI projects never make it past pilot. The reason is almost never the model. It is what surrounds the model — or rather, what does not.

A prototype proves that a capability is technically possible. A production system proves that the capability is **reliable, observable, cost-controlled, and safe to operate** on Monday morning when no one is watching. Those are two different engineering problems, and most teams only fund the first one.

> A prototype answers "can this work?". A production system answers "will this keep working at 3am when nobody's watching?"

## The Problem

The pattern is consistent across industries:

- A notebook or Streamlit demo wows stakeholders
- The team is asked to "productionize it"
- Two months later the system is brittle, slow, expensive, and quietly bypassed

The team usually responds by tuning prompts or swapping models. Neither fixes the actual problem, because the actual problem is **architectural debt that was never paid down**.

## Why Typical Implementations Fail

The same handful of gaps show up every time:

:::callout warn|The Six Gaps That Kill AI Pilots
- **No evaluation harness.** Quality is judged by anecdote. Every change is a coin flip.
- **No observability.** Failures are invisible until a user complains.
- **Free-form orchestration.** Control flow lives inside the LLM, so behavior is non-reproducible.
- **No cost discipline.** A single inefficient prompt path generates 80% of the bill.
- **No safety boundary.** The model has more authority than any human operator would be granted.
- **No deployment story.** Updates require manual coordination and there is no rollback.
:::

None of these are model problems. All of them are systems problems. And all of them compound: without evaluation you cannot fix observability, without observability you cannot reason about cost, and so on.

## The Maturity Curve

The path from prototype to production is a stack of disciplines, layered in a specific order. Each layer unlocks the next.

\`\`\`mermaid
graph TD
    A[Prototype<br/>notebook / demo] --> B[Evaluation<br/>golden set + automated harness]
    B --> C[Observability<br/>traces, costs, error rates]
    C --> D[Deterministic Orchestration<br/>code-driven control flow]
    D --> E[Validation & Safety<br/>schemas, retries, escalation]
    E --> F[Cost Engineering<br/>routing, caching, distillation]
    F --> G[Deployment & Rollback<br/>versioned, observable, reversible]
    G --> H[Production System<br/>reliable, auditable, operable]
\`\`\`

Skip a layer and the ones above it become unstable. Teams that try to optimize cost before they have observability cannot tell whether their "optimization" silently degraded quality. Teams that deploy before they have validation ship hallucinations as features.

## Architecture Approach

A production AI system is built as a pipeline of clearly separated responsibilities, not as a single LLM call wrapped in retry logic. The LLM is **one bounded component** inside that pipeline:

- Inputs are schema-validated
- Outputs are schema-validated
- Control flow is code, not a model decision
- Every step is observable and replayable
- Failures escalate; they do not silently degrade

:::callout info|Production Design Principle
The LLM is a controlled reasoning component inside a deterministic system, not the system itself. The rest of the architecture is what makes the model's output trustworthy.
:::

## Tradeoffs

Building this is more work than shipping the demo. It is also the work that determines whether the system survives. The honest tradeoffs:

- **Speed vs. reliability.** Adding evaluation and validation slows the first ship by weeks and prevents months of firefighting.
- **Flexibility vs. predictability.** Agent-driven control flow feels powerful and is impossible to debug; deterministic orchestration is boring and operable.
- **Frontier models vs. routed models.** Default to the cheapest model that passes eval; reserve frontier capacity for the hard 5% of cases.

## Expected Outcomes

When the maturity layers are in place, the operational profile changes:

- Quality regressions are caught **before** deployment, not by users
- Cost per request is predictable and trends down over time
- Incidents have traces; root cause is findable in minutes, not days
- New features ship behind eval gates instead of behind hope

## Key Takeaways

- The bottleneck is architecture, not the model
- Evaluation is the first discipline, not the last
- Control flow belongs in code; reasoning belongs in the model
- A production AI system is judged by what happens on bad inputs, not good ones

The teams that internalize this stop rebuilding the same demo and start shipping systems clients can rely on.`,
  },

  {
    slug: "ai-system-architecture-llm-rag-production",
    title: "The Reference Architecture for LLM + RAG Systems That Survive Production",
    excerpt:
      "A layered pipeline that separates retrieval, reasoning, and validation — the reference architecture behind reliable LLM applications at enterprise scale.",
    category: "AI Architecture",
    tags: ["RAG", "Architecture", "LLM", "Reliability"],
    date: "2026-06-04",
    readingMinutes: 8,
    cover: coverRagArchitecture,
    content: `Most LLM applications fail in production not because of model limitations, but because of weak system architecture. When an LLM is wired directly to raw data without orchestration, retrieval, and validation layers, the system becomes unreliable, inconsistent, and difficult to scale.

> A production-grade AI system is not an LLM integration. It is a structured architecture where retrieval, reasoning, and validation are clearly separated.

This article is the reference architecture I deploy for clients building internal AI assistants, document intelligence platforms, and enterprise knowledge systems.

## The Problem

A naive LLM application looks like this: user prompt → LLM → response. It works on the first ten queries. It fails on the next ten thousand because:

- The model has no grounded source of truth
- Outputs are unstructured and unverifiable
- One bad prompt path can take down the entire service
- There is no boundary between user input, internal logic, and model authority

## Why Typical Implementations Fail

Single-layer systems collapse under three forces: scale, ambiguity, and accountability. You cannot tell a regulator that "the LLM decided." You cannot debug a system where retrieval, reasoning, and formatting all happen inside one prompt. And you cannot scale a system whose cost is unbounded.

## The Reference Architecture

The fix is to design the system as a multi-layer pipeline where each layer has a single, testable responsibility.

![Layered LLM + RAG architecture](${diagramRagArchitecture})

\`\`\`mermaid
graph LR
    U[User / System] --> A[API Gateway<br/>auth, rate limit, validation]
    A --> O[Workflow Orchestrator<br/>deterministic control flow]
    O --> R[RAG Pipeline<br/>retrieval + reranking]
    R --> L[LLM Layer<br/>structured generation]
    L --> V[Validation Layer<br/>schema + grounding checks]
    V --> Out[Output Layer<br/>APIs, UI, webhooks]
    V -.reject / retry.-> O
\`\`\`

### 1. Request Layer

The entry boundary. Nothing downstream trusts input that has not passed through it.

### 2. API Gateway

Operational concerns that protect the rest of the system: authentication, rate limiting, request validation, secure routing. Without this layer, every downstream component re-implements the same defenses.

### 3. Workflow Orchestrator

Controls execution flow — in code, not in an LLM decision. Detects intent, selects the pipeline, coordinates downstream components. **The LLM chooses tools; the orchestrator chooses the graph.**

### 4. RAG Pipeline

Grounds the model in relevant information: ingestion, chunking, embeddings, vector storage (Pinecone, Weaviate, Milvus), hybrid retrieval, reranking. The LLM never operates on raw inputs — only on retrieved, scoped, validated context.

### 5. LLM Layer

Reasoning and generation. Prompt engineering enforces consistent, structured instructions. Outputs are constrained to schemas.

### 6. Validation Layer

Where production safety is won: schema enforcement, output structure checks, hallucination filtering against retrieved context. Reject early, retry deterministically, escalate when needed.

### 7. Output Layer

API responses, UI surfaces, downstream webhooks — every output carries provenance metadata (which retrieval, which prompt, which validator passed it).

## Tradeoffs and Design Decisions

- **Latency vs. reliability.** Each layer adds milliseconds. Each layer also removes a class of silent failure. Default to reliability.
- **Build vs. buy retrieval.** Managed vector DBs are faster to start with; self-hosted gives you control over hybrid search and reranking.
- **Strictness of validation.** Strict schemas reject more outputs and force better prompts. Loose schemas ship faster and leak hallucinations.

:::callout info|Architecture Rules
- Separate retrieval and generation
- Schema-driven inputs and outputs at every boundary
- Modular layers so components can be swapped independently
- Control flow belongs to the orchestrator, never the LLM
- Every output is observable, attributable, and replayable
:::

## Expected Outcomes

When the architecture is in place, the system becomes reliable in real-world use, easier to scale and maintain, less prone to hallucination, and adaptable across multiple AI use cases on the same backbone.

## Key Takeaways

A production-grade AI system is structured architecture, not an integration. Retrieval, reasoning, and validation are separate concerns. That separation produces predictable behavior, better performance, and long-term scalability — and it is what lets you ship the second, third, and tenth use case on the same foundation.`,
  },

  {
    slug: "llm-only-fails-engineering-extraction-what-works",
    title: "Why LLM-Only Document Extraction Fails — And the Deterministic-First Fix",
    excerpt:
      "Connecting an LLM to a PDF parser works on the first ten documents and fails on the next ten thousand. A deterministic-first architecture for engineering document intelligence.",
    category: "AI Architecture",
    tags: ["Document AI", "Architecture", "Reliability"],
    date: "2026-06-03",
    readingMinutes: 8,
    cover: coverDeterministic,
    content: `Most engineering teams approach document extraction the same way: connect an LLM to a PDF parser, write a prompt, ship a demo. It works on the first ten documents. It fails on the next ten thousand.

The failure is not the model. It is the architecture around it.

> Production document intelligence is not a prompting problem. It is a systems problem.

## The Problem: Documents Are Not Text

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

## The Deterministic-First Architecture

Invert the pipeline. Instead of letting a language model interpret raw geometry, **extract structure deterministically first** and let the model reason over a clean, validated representation.

![Deterministic-first document intelligence pipeline](${diagramStages})

\`\`\`mermaid
graph TD
    A[Raw Document<br/>PDF / DWG / DXF] --> B[Deterministic Extraction<br/>geometry, layers, OCR]
    B --> C[Structural Decomposition<br/>zones, systems, adjacency]
    C --> D[Schema Representation<br/>typed entities + provenance]
    D --> E[Controlled LLM<br/>narrow reasoning tasks]
    E --> F[Validated Output<br/>CSV, JSON, BIM]
    E -.reject.-> D
\`\`\`

### 1. Deterministic Extraction

No interpretation. Faithful capture of what the document contains: PDF structure parsing (vector vs raster), CAD extraction (layers, blocks, entity tables), targeted OCR on regions that genuinely need it. The output is raw but **complete and lossless**.

### 2. Structural Decomposition

Group raw fragments into meaningful units using deterministic rules: zones, system-level segmentation (HVAC networks, electrical circuits), repeated component detection via geometric similarity, adjacency and connectivity graphs. The document becomes a **structured system model**.

### 3. Schema-Based Representation

Entities are formalized against strict schemas, every field validated and traceable to the source geometry that produced it. Ducts become typed flow paths. Equipment becomes labeled system nodes. Dimensions become unit-checked measurements. **Provenance is built in.**

### 4. Controlled LLM Integration

Only now does the model enter the pipeline. It never sees a raw PDF. It operates on structured data, scoped to narrow tasks: resolving ambiguous labels, classifying from constrained vocabularies, handling edge cases the rule layers explicitly defer.

:::callout info|Production Design Principle
The LLM is a **controlled reasoning component inside a deterministic system**, not the system itself. Schema-validated input. Schema-validated output. Bounded scope. Replayable inputs. Observable outputs. If you cannot describe what the model is allowed to do in one sentence, the scope is too wide.
:::

### 5. Production Outputs

Artifacts downstream workflows actually consume: CSV/Excel for estimation, JSON for APIs and databases, BIM-compatible structured datasets. Every output carries provenance — source page, source geometry, extraction stage, validation status.

## Tradeoffs

- **Engineering effort up front.** Deterministic extractors take longer to build than a single prompt. They also keep working.
- **Domain coupling.** Rule layers are domain-specific; the LLM layer is reusable. Plan for that split.
- **Coverage gaps.** Some entities will always fall through to the model. Make sure the model knows when it is guessing.

## Expected Outcomes

Reproducible outputs across runs. Auditable provenance for every value. Confidence calibration that survives volume. And — most importantly — a system whose failures are diagnosable instead of mysterious.

## Key Takeaways

LLM-only extraction fails because the model is asked to do work that should never have reached it. The discipline is to **reduce ambiguity before the model is involved**, treat the LLM as a narrow reasoning layer, and make the rest of the system deterministic, observable, and maintainable.`,
  },

  // ──────────────────────────────────────────────────────────
  // SYSTEMS
  // ──────────────────────────────────────────────────────────
  {
    slug: "production-rag-pitfalls",
    title: "The Five RAG Pitfalls That Quietly Kill Enterprise Deployments",
    excerpt:
      "Chunking, retrieval, evaluation, access control, freshness — the five places RAG systems silently fail in production and how to fix each one.",
    category: "RAG Systems",
    tags: ["RAG", "Vector Search", "Evaluation", "Access Control"],
    date: "2026-05-20",
    readingMinutes: 11,
    content: `Enterprise RAG looks deceptively simple: embed documents, search, generate. The reason most pilots never reach production is that each of those steps hides a failure mode that only surfaces at scale.

> RAG systems do not fail loudly. They quietly return plausible answers grounded in the wrong documents.

## The Problem

A RAG pilot built on the defaults — naive chunking, single-vector retrieval, no eval — looks accurate at small scale. As the corpus grows, retrieval quality degrades, permission boundaries leak, and freshness drifts. Users lose trust, often without anyone noticing why.

## The Five Pitfalls

\`\`\`mermaid
graph LR
    Q[Query] --> C[Chunking<br/>pitfall #1]
    C --> R[Retrieval<br/>pitfall #2]
    R --> E[Evaluation<br/>pitfall #3]
    R --> A[Access Control<br/>pitfall #4]
    R --> F[Freshness<br/>pitfall #5]
    E & A & F --> G[Generation]
\`\`\`

### 1. Chunking

Default 1000-token splitters break documents at meaningless boundaries — mid-sentence, mid-table, mid-clause. Retrieval pulls fragments that have lost their context, and the model fills the gap by inventing it.

**Fix:** semantic chunking that respects document structure (headings, sections, tables). Typical improvement is 20–40% on retrieval quality with no infra change. For long-form documents, layer in parent-document retrieval so the model sees the chunk plus its surrounding context.

### 2. Retrieval

Teams over-rotate on dense vectors and under-invest in everything else. Pure cosine similarity misses exact-match queries (product IDs, error codes, named entities) and ignores metadata.

**Fix:** hybrid search — BM25 + dense vectors + structured metadata filters — followed by a reranker. The reranker is the single biggest quality lever most teams have not pulled.

### 3. Evaluation

Without a golden set and an automated harness, every prompt change is a coin flip. "It looks better" is not a signal.

**Fix:** build a 100–500 example eval set with ground-truth answers. Run it on every change. Track retrieval recall, answer faithfulness, and answer relevance as separate metrics — they fail for different reasons.

:::callout warn|The Silent Failure
Without eval, RAG systems degrade invisibly. A prompt tweak that improves one query type often regresses another, and no one notices until users stop using the product.
:::

### 4. Access Control

The model will happily synthesize content from documents the user was never supposed to see. Permission checks in the UI do not protect you — the retrieval layer is the boundary that matters.

**Fix:** enforce permissions at retrieval time using metadata filters tied to the user's identity. Never rely on post-generation filtering; by then the leak has already happened in the model's context window.

### 5. Freshness

Documents change. Permissions change. Documents get deleted. A RAG index that ignores any of these slowly becomes a source of confidently wrong answers.

**Fix:** incremental sync, tombstone handling for deletes, embedding versioning so you can re-embed without downtime, and a freshness SLA per document type.

## Tradeoffs

- **Hybrid search adds latency.** Worth it; rerank only the top-N candidates.
- **Strict permissions reduce recall.** This is the correct tradeoff.
- **Eval sets need maintenance.** Budget for it.

## Expected Outcomes

A RAG system with these five pitfalls addressed shifts from "impressive demo" to "boring utility" — answers are grounded, permissions hold, and quality regressions are caught before users see them.

## Key Takeaways

The RAG quality bar is not set by your embeddings. It is set by the discipline around chunking, retrieval design, evaluation, access control, and freshness. Defaults are tuned for demos, not for production.`,
  },

  {
    slug: "designing-stateful-multi-agent-systems",
    title: "Multi-Agent Systems That Hold Up Under Real Workloads",
    excerpt:
      "Why most agent demos collapse at scale, and the four architectural pillars — explicit state, deterministic orchestration, validation loops, cost-aware routing — that keep them reliable.",
    category: "AI Agents",
    tags: ["LangGraph", "Agents", "Orchestration"],
    date: "2026-05-10",
    readingMinutes: 10,
    content: `Multi-agent systems look magical in demos and collapse the moment they meet real-world data. The difference between a prototype and a production system is almost never the model — it is the architecture around the model.

> If your agent system has no shared state object, no deterministic control flow, no critique step, and no model routing — it is a demo, not a system.

## The Problem

Agent frameworks make it trivially easy to wire up multi-step LLM workflows that look impressive in a notebook. Two weeks into production they exhibit the same pathologies:

- Non-reproducible behavior between runs of the same input
- Infinite loops or runaway tool calls
- Costs that scale with the bug count, not the user count
- Failures that are impossible to root-cause because nothing is replayable

## Why Typical Implementations Fail

The root cause is almost always that **control flow has been delegated to the LLM**. When an agent decides which agent to call next, you have lost the ability to reason about your own system. The model is non-deterministic. Your control flow is now non-deterministic. There is no debugger for that.

## The Four Pillars

\`\`\`mermaid
graph TD
    S[Shared State Object<br/>typed, serializable, replayable] --> O[Deterministic Orchestrator<br/>code-driven graph]
    O --> P[Producer Agent<br/>generates candidate]
    P --> C[Critic / Validator<br/>schema + rubric]
    C -->|accept| Out[Output]
    C -->|retry| P
    C -->|escalate| E[Frontier Model<br/>last resort]
    E --> Out
\`\`\`

### 1. Explicit State

Treat agents as pure functions over a shared state object. Every transition writes to state, every read goes through state. The state object is typed, serializable, and persisted. **Persist it and you can replay any failed run.** That single property turns post-mortems from guesswork into a debugger session.

### 2. Deterministic Orchestration

The graph of "which agent runs when" is code, not an LLM decision. LLMs choose tools; they don't choose control flow. Mix those up and you lose the ability to reason about behavior, set retry budgets, or guarantee termination.

### 3. Validation Loops

Every agent output passes through a critique step that can accept, reject, or escalate. The critic is **cheaper than the producer** — that is the whole trick. When possible, replace the LLM critic with a deterministic validator (schema, regex, business rules). LLM critics are a fallback, not a default.

### 4. Cost-Aware Model Routing

Frontier models for hard reasoning, small models for everything else. Default to the cheapest model that passes eval; escalate only when the validator rejects twice. Done correctly this is a 5–10x cost reduction with no quality loss.

:::callout info|The Operating Principle
Bound everything. Bound the retry count. Bound the token budget. Bound the tool-call depth. An agent without bounds is a runaway process waiting for a bill.
:::

## Tradeoffs

- **Explicit state is verbose.** It is also the foundation everything else stands on.
- **Deterministic orchestration removes "emergent" behavior.** That is the goal.
- **Routing requires eval.** Without eval you cannot tell which tier each task belongs in.

## Expected Outcomes

Replayable runs. Bounded cost and latency. Self-correcting outputs. Root-cause analysis that takes minutes instead of days. And — the property clients actually pay for — behavior that does not silently change between Tuesday and Friday.

## Key Takeaways

- State is the contract; everything else is plumbing
- Control flow belongs in code; reasoning belongs in the model
- The critic is the reliability layer; build it before you scale
- Model choice is a routing decision, not a foundation`,
  },

  {
    slug: "llm-cost-engineering",
    title: "LLM Cost Engineering: 5–10x Cheaper Without Hurting Quality",
    excerpt:
      "Caching, routing, distillation, structured outputs — the disciplined practices that turn a runaway OpenAI bill into a controlled, observable line item.",
    category: "LLM Engineering",
    tags: ["Cost", "Routing", "Caching", "FinOps"],
    date: "2026-04-15",
    readingMinutes: 9,
    content: `LLM bills explode for the same reason cloud bills explode: defaults are tuned for convenience, not economics. A disciplined cost program typically delivers 5–10x reduction with no quality regression — but only if you treat cost as an engineering metric, not a procurement problem.

> Most teams discover their LLM bill in the second month and respond by switching models. The bill comes back the same.

## The Problem

A typical AI workload concentrates 70–90% of spend in a handful of paths:

- A single retrieval call that pulls 30k tokens of context per query
- A "for safety" frontier-model fallback that fires on every request
- Verbose prompts re-sent on every retry instead of cached
- Free-form outputs that double the token count and break parsing

You cannot optimize what you cannot see, and most teams have no per-path cost attribution.

## Why Typical Implementations Fail

Cost optimization usually starts with "let's switch to a cheaper model" and ends with quality regressions, a rollback, and the original bill. The reason: model choice is the **last** lever, not the first. The earlier levers — caching, routing, output structure, context size — have larger effects and no quality cost.

## The Cost Engineering Pipeline

\`\`\`mermaid
graph TD
    R[Request] --> Cache{Prompt Cache<br/>hit?}
    Cache -->|hit| Out[Cached Response]
    Cache -->|miss| Class[Classifier<br/>route by difficulty]
    Class -->|easy| Small[Small Model<br/>e.g. 4o-mini, Haiku]
    Class -->|hard| Large[Frontier Model<br/>e.g. 4o, Sonnet]
    Small --> V[Validator]
    Large --> V
    V -->|pass| Out
    V -->|fail + budget left| Class
\`\`\`

### 1. Observability First

Per-request token counts, model, latency, cost, and outcome. Aggregated by feature, user, and prompt template. Without this you are guessing.

### 2. Prompt Caching

Modern providers (OpenAI, Anthropic, Gemini) all support prompt caching. System prompts, few-shot examples, and stable context should be in the cached prefix. Easy 50–80% reduction on cacheable workloads.

### 3. Model Routing

Classify the difficulty of each request and route. A cheap classifier (or even a heuristic) picks the right tier. Frontier models become a fallback for the 5–10% of hard cases, not the default.

### 4. Structured Outputs

JSON-mode and schema-constrained generation reduce output tokens, eliminate parsing retries, and make validation deterministic. Free-form prose is the most expensive output format.

### 5. Context Discipline

The single biggest waste in RAG pipelines is over-retrieval. Rerank to top-5, not top-50. Compress retrieved chunks when they exceed a budget. Track tokens-in-context as a first-class metric.

### 6. Distillation (When It Pays)

For high-volume, narrow tasks, distill a frontier model's outputs into a fine-tuned small model. Pays back in weeks at scale; not worth it under ~100k requests/month.

:::callout info|Cost Engineering Rules
- Measure before optimizing
- Cache before routing
- Route before switching models
- Switch models before fine-tuning
- Fine-tune only when volume justifies the maintenance cost
:::

## Tradeoffs

- **Caching couples you to a provider's caching semantics.** Worth it.
- **Routing requires eval to validate quality holds.** Build the eval anyway.
- **Distillation creates a new artifact to maintain.** Only worth it at volume.

## Expected Outcomes

Per-request cost trends down month over month. The frontier-model fallback rate is visible and bounded. Cost regressions are caught in CI alongside quality regressions. Finance stops asking why the bill is unpredictable.

## Key Takeaways

LLM cost is an engineering metric. Treat it like latency: measure it, attribute it, set budgets, and regress on it. The teams that do this routinely run 5–10x cheaper than teams that do not — on the same workloads, at the same quality.`,
  },

  // ──────────────────────────────────────────────────────────
  // IMPLEMENTATION
  // ──────────────────────────────────────────────────────────
  {
    slug: "tutorial-langgraph-validation-loops",
    title: "Tutorial: Building Self-Correcting Agents with LangGraph",
    excerpt:
      "A code-first walkthrough of self-correcting agents using critique nodes, retry budgets, and structured outputs — the architecture pattern behind reliable extraction.",
    category: "Tutorials",
    tags: ["LangGraph", "Tutorial", "Validation"],
    date: "2026-03-20",
    readingMinutes: 12,
    content: `In this tutorial we build a self-correcting LangGraph agent. The producer node generates a candidate; the critic node validates it against a schema and rubric; the controller decides whether to accept, retry, or escalate. By the end you will have a working graph you can adapt to extraction, code generation, or any task where "wrong but confident" is the failure mode you need to eliminate.

## The Architecture

\`\`\`mermaid
graph TD
    Start[Input] --> P[Producer<br/>small model]
    P --> C[Critic<br/>schema + rubric]
    C -->|accept| A[Accept]
    C -->|retry, budget left| P
    C -->|exhausted| E[Escalate<br/>frontier model]
    A --> End[Output]
    E --> End
\`\`\`

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

- Add a **golden eval set** and run the graph against it on every change.
- Emit traces to LangSmith or OpenTelemetry — every node transition, every token count, every retry reason.
- Replace the rubric-based critic with a **deterministic validator** wherever possible (regex, schema, business rules). LLM critics are a fallback, not a default.
- Swap the producer for a tool-calling agent when extraction isn't enough and the model actually needs to query systems.

The architecture stays the same. That's the point.`,
  },

  // ──────────────────────────────────────────────────────────
  // PROOF
  // ──────────────────────────────────────────────────────────
  {
    slug: "case-study-logistics-document-ai",
    title: "Case Study: Cutting Manual Document Processing by 80% for a Logistics Operator",
    excerpt:
      "A mid-market logistics operator was drowning in PDF bills of lading. A layout-aware OCR + LLM extraction pipeline replaced manual entry and unlocked operational data trapped in scans.",
    category: "Case Studies",
    tags: ["Logistics", "Document AI", "OCR"],
    date: "2026-02-10",
    readingMinutes: 8,
    content: `A mid-market logistics operator was processing 12,000+ bills of lading, customs forms, and proof-of-delivery scans per month — almost entirely by hand. The operational data was trapped in PDFs, manual entry errors created billing disputes, and the team could not staff up fast enough to match growth.

This case study walks through the architecture, evaluation strategy, and rollout plan behind the production system we shipped.

## The Problem

- 12,000+ documents per month across five formats, three languages
- Manual data entry averaged 6 minutes per document, with a 4% error rate
- Errors surfaced downstream as billing disputes that cost ~$180k per year
- Operational reporting lagged by 7–10 days because the data did not exist in structured form until weeks after the shipment

The team had previously tried an off-the-shelf OCR product. It hit ~70% field accuracy and required manual review on every document, which provided no real lift over typing.

## Why the Previous Attempts Failed

Two patterns. The first was a pure OCR vendor — accurate on text but unable to understand structure (tables split across pages, multi-line addresses, line items with merged cells). The second was a pure LLM approach — ChatGPT-style prompting on scanned images. It hallucinated quantities on poor scans and produced non-reproducible outputs.

Neither approach separated **extraction** from **interpretation**. Both asked one component to do too much.

## The Architecture

\`\`\`mermaid
graph TD
    PDF[Incoming PDF / Scan] --> Class[Document Classifier<br/>BoL / Customs / POD]
    Class --> Layout[Layout-Aware OCR<br/>tables, regions, multi-page]
    Layout --> Struct[Structural Decomposition<br/>fields, line items, addresses]
    Struct --> LLM[Controlled LLM<br/>disambiguation only]
    LLM --> V[Schema Validation<br/>units, totals, IDs]
    V -->|pass| ERP[ERP Sync]
    V -->|fail| Q[Human Review Queue<br/>~7% of docs]
\`\`\`

The system is a five-stage pipeline. The LLM only enters at stage four, and only for narrow tasks (resolving ambiguous addresses, normalizing carrier names, inferring missing field types from context). Everything else is deterministic.

## What Each Layer Does

**Classifier** routes each document to the correct downstream schema. Trained on 2,000 labeled examples; runs in 40ms per page.

**Layout-aware OCR** uses a structure-preserving parser (not flat text OCR). Tables stay tables. Multi-page line items reassemble correctly. Confidence scores attach to every extracted token.

**Structural decomposition** applies deterministic rules: line items reconcile against totals, address blocks are parsed into components, weight/volume units are normalized.

**Controlled LLM** handles the 15% of fields where deterministic rules cannot decide. The model receives structured candidates, never raw scans. Outputs are schema-constrained.

**Schema validation** is the gate before ERP sync. Totals must reconcile to the cent. IDs must match expected formats. Failed validation routes to a human review queue with the specific failure highlighted.

## Evaluation Strategy

A 400-document golden set covering all five formats, both clean and degraded scans. Tracked separately:

- **Field-level accuracy** (per-field, not aggregate)
- **Document-level pass rate** (full document, no manual touch required)
- **Confidence calibration** (does the system know when it does not know)

Every model or rule change ran against the golden set in CI before deployment.

## Rollout

Shadow mode for six weeks — system ran in parallel with manual entry, outputs compared but not used. Then a gated rollout: easy document types first (PoDs), then mid-complexity (BoLs), then customs. Human review queue was the safety net throughout.

:::callout info|What Made the Rollout Work
The shadow-mode period generated the disagreement data that drove every fix. Without it, the team would have been debugging in production with no ground truth.
:::

## Outcomes

- **80% reduction in manual processing time** across all document types
- **Document-level pass rate of 93%** — only 7% routed to human review
- **Field-level accuracy of 99.2%** on validated outputs
- **Billing disputes down ~70%** within the first quarter
- **Operational data available within minutes** of document receipt, instead of days

## Tradeoffs Worth Naming

- The deterministic layers are domain-specific and took three engineer-weeks each to build. They will not transfer to a different document type without work.
- Human review remains essential for low-confidence cases. The system makes the humans faster; it does not eliminate them.
- The eval set has to be maintained as document formats drift. Budget for it.

## Key Takeaways

The lift did not come from a better model. It came from an architecture that **kept the model on a short leash** and let deterministic components do the work they were better suited for. That same pattern applies to almost every document intelligence problem worth solving.`,
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
