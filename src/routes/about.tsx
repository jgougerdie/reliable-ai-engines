import { createFileRoute, Link } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { GraduationCap, Award, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — AI Architect | Architect.systems" },
      { name: "description", content: "AI Architect with 14+ years building production LLM, RAG, and agent systems. AWS Machine Learning Specialty certified." },
      { property: "og:title", content: "About — AI Architect" },
      { property: "og:description", content: "14+ years engineering production software and AI systems." },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: About,
});

const education = [
  { school: "Georgia Tech", detail: "Computer Science & Software Engineering" },
  { school: "University of Hamburg", detail: "MSc" },
  { school: "DeepLearning.AI", detail: "AI Engineering & Machine Learning Architecture" },
];

const certs = [
  "AWS Certified Machine Learning — Specialty",
  "Generative AI with Large Language Models",
];

const expertise = [
  "LLM-powered applications", "RAG systems", "AI agents & multi-agent systems",
  "Production AI infrastructure", "Enterprise AI integrations", "AI architecture & consulting",
];

function About() {
  return (
    <>
      <Section
        eyebrow="About"
        titleAs="h1"
        title={<>Designing AI systems <span className="text-gradient-brand">correctly from the start</span></>}
        description="14+ years building production software and AI systems for teams that need their infrastructure to work — not just demo."
      >
        <div className="grid lg:grid-cols-[1.3fr_1fr] gap-12">
          <div className="space-y-6 text-muted-foreground leading-relaxed">
            <p className="text-foreground/90 text-lg">
              Most AI projects fail during production due to architecture mistakes,
              scalability problems, fragmented systems, and poor implementation
              decisions. My focus is designing AI systems correctly from the
              beginning — not patching them later.
            </p>
            <p>
              I work as an AI Architect with technical and operational teams
              building LLM applications, RAG systems, multi-agent automations, and
              the production infrastructure underneath them. Engagements range
              from architecture reviews and reference designs to full
              implementations and fractional architect roles.
            </p>
            <p>
              I value disciplined engineering over hype: explicit state,
              deterministic orchestration, evaluation-driven development, and
              cost-aware design — the kind of foundations enterprise systems
              should have been built on from day one.
            </p>
          </div>

          <div className="space-y-5">
            <div className="card-glow rounded-2xl p-6">
              <div className="flex items-center gap-2 text-sm font-mono text-[color:var(--brand)]">
                <GraduationCap size={16}/> Education
              </div>
              <ul className="mt-4 space-y-3">
                {education.map((e) => (
                  <li key={e.school}>
                    <div className="font-semibold">{e.school}</div>
                    <div className="text-sm text-muted-foreground">{e.detail}</div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="card-glow rounded-2xl p-6">
              <div className="flex items-center gap-2 text-sm font-mono text-[color:var(--brand)]">
                <Award size={16}/> Certifications
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {certs.map((c) => (
                  <li key={c} className="text-muted-foreground">{c}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold">Areas of focus</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {expertise.map((e) => (
              <span key={e} className="px-4 py-2 rounded-lg border border-border bg-[var(--surface)] text-sm text-muted-foreground">
                {e}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-16 card-glow rounded-2xl p-8 md:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-semibold">Have an AI system to build or de-risk?</h3>
            <p className="text-muted-foreground mt-2">Start with a 60-minute architecture call.</p>
          </div>
          <Link to="/contact" className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium btn-primary">
            Book a consultation <ArrowRight size={16}/>
          </Link>
        </div>
      </Section>
    </>
  );
}
