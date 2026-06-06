import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight, Cpu, Database, Workflow, Network, Cloud, Layers,
  CheckCircle2, Sparkles,
} from "lucide-react";
import { AgentGraph } from "@/components/site/AgentGraph";
import { Section } from "@/components/site/Section";
import { projects } from "@/data/projects";
import { posts } from "@/data/blog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Architect — Production-Grade LLM, RAG & Agent Systems" },
      {
        name: "description",
        content:
          "Production-grade AI systems that scale beyond prototypes. LLM applications, RAG pipelines, AI agents, and workflow automation engineered for reliability.",
      },
      { property: "og:title", content: "AI Architect — Production-Grade AI Systems" },
      { property: "og:description", content: "LLMs, RAG, agents, and automation built for real business operations." },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

const services = [
  { icon: Layers, title: "AI Architecture", desc: "Design scalable production systems from first principles." },
  { icon: Cpu, title: "LLM Applications", desc: "OpenAI, Claude, Llama, and bespoke LLM APIs in production." },
  { icon: Database, title: "RAG Systems", desc: "Knowledge retrieval, vector search, and grounded generation." },
  { icon: Network, title: "AI Agents", desc: "Autonomous workflows and stateful multi-agent systems." },
  { icon: Workflow, title: "Workflow Automation", desc: "Operational AI woven into real business processes." },
  { icon: Cloud, title: "Cloud Deployment", desc: "AWS, Azure, GCP, Docker — production infrastructure." },
];

const stack = [
  "OpenAI", "Claude", "LangChain", "LangGraph", "Pinecone", "Vector DBs",
  "FastAPI", "Python", "Docker", "AWS", "MLOps", "AI Architecture",
];

const processSteps = [
  { n: "01", title: "Discovery", desc: "Map business goals, constraints, and where AI actually creates value." },
  { n: "02", title: "Architecture", desc: "Design the system end-to-end before writing production code." },
  { n: "03", title: "Implementation", desc: "Build with disciplined engineering, not glue code." },
  { n: "04", title: "Validation", desc: "Evaluation harnesses, golden sets, and continuous quality checks." },
  { n: "05", title: "Deployment", desc: "Ship with observability, rollback paths, and cost controls." },
  { n: "06", title: "Optimization", desc: "Iterate on quality, latency, and cost from real production data." },
];

function Home() {
  const featuredPosts = posts.filter((p) => p.featured).slice(0, 2);
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid pointer-events-none" />
        <div className="mx-auto max-w-7xl px-6 pt-20 md:pt-28 pb-20 grid lg:grid-cols-[1.15fr_1fr] gap-12 items-center">
          <div className="animate-fade-up">
            <span className="chip"><Sparkles size={12}/> AI Architect · LLMs · RAG · Automation</span>
            <h1 className="mt-6 text-4xl md:text-6xl font-semibold tracking-tight leading-[1.05]">
              Production-Grade <span className="text-gradient-brand">AI Systems</span> That Scale Beyond Prototypes
            </h1>
            <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground">
              Designing reliable AI systems using LLMs, RAG pipelines, AI agents,
              workflow automation, and scalable infrastructure — engineered for
              the environments where reliability and cost matter.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium btn-primary">
                View Projects <ArrowRight size={16}/>
              </Link>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium btn-ghost">
                Book Consultation
              </Link>
            </div>
            <dl className="mt-12 grid grid-cols-3 gap-6 max-w-lg">
              {[
                { k: "14+", v: "Years engineering" },
                { k: "~70%", v: "Avg workload reduction" },
                { k: "Prod", v: "First-mile mindset" },
              ].map((s) => (
                <div key={s.v}>
                  <div className="text-2xl md:text-3xl font-semibold text-gradient-brand font-mono">{s.k}</div>
                  <div className="text-xs text-muted-foreground mt-1">{s.v}</div>
                </div>
              ))}
            </dl>
          </div>
          <div className="relative animate-fade-up">
            <div className="absolute -inset-6 bg-gradient-to-tr from-[var(--brand)]/20 to-[var(--brand-violet)]/20 blur-3xl rounded-3xl" />
            <AgentGraph />
          </div>
        </div>
      </section>

      {/* TRUSTED / VALUE PROP STRIP */}
      <section className="mx-auto max-w-7xl px-6">
        <div className="card-glow rounded-2xl p-8 md:p-10 grid md:grid-cols-3 gap-8">
          {[
            { k: "Architecture-first", v: "Most AI projects fail in production due to architecture mistakes — not models." },
            { k: "Reliability", v: "Stateful workflows, validation loops, and observability by default." },
            { k: "Cost discipline", v: "Model routing, caching, and structured outputs that hold the bill down." },
          ].map((s) => (
            <div key={s.k}>
              <div className="text-sm font-mono text-[color:var(--brand)]">{s.k}</div>
              <p className="mt-2 text-sm text-muted-foreground">{s.v}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICES */}
      <Section
        eyebrow="Services"
        title={<>Engineering the full <span className="text-gradient-brand">AI stack</span></>}
        description="From architecture to deployment — production AI systems that survive contact with real users, real data, and real budgets."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-glow rounded-xl p-6">
              <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand)]/20 to-[var(--brand-violet)]/20 border border-border">
                <Icon size={18} className="text-[color:var(--brand)]"/>
              </div>
              <h3 className="mt-4 text-lg font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* PORTFOLIO PREVIEW */}
      <Section
        eyebrow="Selected Work"
        title="Production AI systems shipped end-to-end"
        description="A sample of recent engagements — multi-agent automation, document AI, and enterprise RAG."
      >
        <div className="grid lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link key={p.slug} to="/portfolio/$slug" params={{ slug: p.slug }} className="card-glow rounded-xl overflow-hidden group">
              <div className="relative aspect-[16/10] overflow-hidden">
                <img src={p.image} alt={p.title} loading="lazy" width={1600} height={1000} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
              </div>
              <div className="p-6">
                <span className="chip">{p.role}</span>
                <h3 className="mt-3 text-lg font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm text-[color:var(--brand)]">
                  Read case study <ArrowRight size={14}/>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* STACK */}
      <Section
        eyebrow="Technical Expertise"
        title="The stack behind the systems"
        description="Battle-tested tools, used with intent — never just because they're trendy."
      >
        <div className="flex flex-wrap gap-2">
          {stack.map((s) => (
            <span key={s} className="px-4 py-2 rounded-lg border border-border bg-[var(--surface)] text-sm font-mono text-muted-foreground hover:text-foreground hover:border-[color:var(--brand)]/50 transition">
              {s}
            </span>
          ))}
        </div>
      </Section>

      {/* PROCESS */}
      <Section
        eyebrow="Process"
        title="How a system actually gets built"
        description="A six-stage engagement model that puts architecture before code and evaluation before launch."
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden">
          {processSteps.map((s) => (
            <div key={s.n} className="bg-[var(--surface)] p-7">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-[color:var(--brand)]">{s.n}</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* BLOG PREVIEW */}
      <Section
        eyebrow="Writing"
        title="Field notes from production AI"
        description="Practical perspectives on agents, RAG, LLM engineering, and the architecture decisions that make or break systems."
      >
        <div className="grid md:grid-cols-2 gap-6">
          {featuredPosts.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="card-glow rounded-xl p-7">
              <span className="chip">{p.category}</span>
              <h3 className="mt-4 text-xl font-semibold leading-snug">{p.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{p.excerpt}</p>
              <div className="mt-5 flex items-center justify-between text-xs text-muted-foreground font-mono">
                <span>{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span>{p.readingMinutes} min read</span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-sm text-[color:var(--brand)]">
            All articles <ArrowRight size={14}/>
          </Link>
        </div>
      </Section>

      {/* CTA */}
      <Section>
        <div className="relative overflow-hidden rounded-3xl card-glow p-10 md:p-16">
          <div className="absolute -inset-32 bg-gradient-to-tr from-[var(--brand)]/25 to-[var(--brand-violet)]/25 blur-3xl pointer-events-none" />
          <div className="relative grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">
                Have an AI system that needs to graduate from prototype to production?
              </h2>
              <p className="mt-4 text-muted-foreground max-w-2xl">
                I work with technical and operational teams to design, build, and
                de-risk LLM, RAG, and agent systems that need to behave reliably
                in the real world.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/contact" className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium btn-primary">
                  Book Consultation <ArrowRight size={16}/>
                </Link>
                <Link to="/portfolio" className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium btn-ghost">
                  View Projects
                </Link>
              </div>
            </div>
            <ul className="space-y-3 text-sm">
              {[
                "Architecture review & system design",
                "Multi-agent and RAG implementations",
                "Production readiness, eval & cost optimization",
                "Fractional AI architect engagements",
              ].map((x) => (
                <li key={x} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[color:var(--brand)] mt-0.5 shrink-0"/>
                  <span className="text-muted-foreground">{x}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </>
  );
}
