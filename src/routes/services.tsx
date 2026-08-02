import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import {
  Layers, Cpu, Database, Network, Workflow, Cloud, ArrowRight, CheckCircle2,
} from "lucide-react";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — AI Architecture, LLMs, RAG, Agents & Automation" },
      { name: "description", content: "Production AI services: architecture, LLM apps, RAG systems, multi-agent automation, workflow automation, and cloud deployment." },
      { property: "og:title", content: "Services — AI Architect" },
      { property: "og:description", content: "Production AI engagements across architecture, LLMs, RAG, agents, and cloud." },
      { property: "og:url", content: "/services" },
    ],
    links: [{ rel: "canonical", href: "/services" }],
  }),
  component: Services,
});

const services = [
  { icon: Layers, title: "AI Architecture", desc: "End-to-end system design with explicit state, deterministic orchestration, and observability baked in.",
    bullets: ["Reference architectures", "Tech selection & trade-offs", "Roadmaps and de-risking plans"] },
  { icon: Cpu, title: "LLM Applications", desc: "OpenAI, Claude, Llama, and bespoke APIs woven into real product surfaces.",
    bullets: ["Structured outputs", "Prompt engineering & evaluation", "Streaming, tool use, function calling"] },
  { icon: Database, title: "RAG Systems", desc: "Federated retrieval over fragmented enterprise knowledge — grounded, secure, and current.",
    bullets: ["Hybrid retrieval + reranking", "Permission-aware indexes", "Continuous evaluation harness"] },
  { icon: Network, title: "AI Agents", desc: "Stateful, validated, cost-aware multi-agent systems that hold up under real workloads.",
    bullets: ["LangGraph orchestration", "Critique & self-correction loops", "Replayable execution traces"] },
  { icon: Workflow, title: "Workflow Automation", desc: "Operational AI woven into CRMs, ERPs, ticketing, and back-office systems.",
    bullets: ["Process discovery", "Human-in-the-loop design", "ROI tracking & rollouts"] },
  { icon: Cloud, title: "Cloud Deployment", desc: "AWS, Azure, GCP, Docker — productionized with cost, latency, and reliability budgets.",
    bullets: ["Infra as code", "Observability stack", "Scaling & cost controls"] },
];

function Services() {
  return (
    <>
      <Section
        eyebrow="Services"
        titleAs="h1"
        title={<>Production AI, engineered like serious <span className="text-gradient-brand">infrastructure</span></>}
        description="Six focused service areas covering the entire lifecycle of an AI system — from architecture to ongoing optimization."
      >
        <div className="grid md:grid-cols-2 gap-5">
          {services.map(({ icon: Icon, title, desc, bullets }) => (
            <div key={title} className="card-glow rounded-2xl p-7">
              <div className="flex items-start justify-between">
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--brand)]/20 to-[var(--brand-violet)]/20 border border-border">
                  <Icon size={20} className="text-[color:var(--brand)]"/>
                </div>
              </div>
              <h3 className="mt-5 text-xl font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              <ul className="mt-5 space-y-2 text-sm">
                {bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-muted-foreground">
                    <CheckCircle2 size={16} className="text-[color:var(--brand)] mt-0.5 shrink-0"/>{b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 card-glow rounded-2xl p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold">Not sure where to start?</h3>
            <p className="text-muted-foreground mt-2 max-w-xl">
              A 60-minute architecture call usually clarifies the path forward —
              what to build, what to defer, and what to retire.
            </p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium btn-primary">
            Book a consultation <ArrowRight size={16}/>
          </Link>
        </div>
      </Section>
    </>
  );
}
