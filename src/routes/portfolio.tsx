import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { projects } from "@/data/projects";
import { ArrowRight } from "lucide-react";

export const Route = createFileRoute("/portfolio")({
  head: () => ({
    meta: [
      { title: "Portfolio — Production AI Systems" },
      { name: "description", content: "Selected work: multi-agent automation, document AI, and enterprise RAG systems shipped to production." },
      { property: "og:title", content: "Portfolio — AI Architect" },
      { property: "og:description", content: "Multi-agent, document AI, and enterprise RAG case studies." },
      { property: "og:url", content: "/portfolio" },
    ],
    links: [{ rel: "canonical", href: "/portfolio" }],
  }),
  component: PortfolioLayout,
});

function PortfolioLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId === "/portfolio/$slug");
  if (isChild) return <Outlet />;

  return (
    <Section
      eyebrow="Portfolio"
      titleAs="h1"
      title="Production AI systems, end-to-end"
      description="Each engagement combines architecture, implementation, and rigorous evaluation — not throwaway prototypes."
    >
      <div className="grid lg:grid-cols-3 gap-6">
        {projects.map((p) => (
          <Link key={p.slug} to="/portfolio/$slug" params={{ slug: p.slug }} className="card-glow rounded-2xl overflow-hidden group">
            <div className="relative aspect-[16/10] overflow-hidden">
              <img src={p.image} alt={p.title} loading="lazy" width={1600} height={1000} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
              <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
              <div className="absolute top-4 left-4"><span className="chip">{p.role}</span></div>
            </div>
            <div className="p-6">
              <h3 className="text-lg font-semibold leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.summary}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.technologies.slice(0, 4).map((t) => (
                  <span key={t} className="text-[11px] font-mono text-muted-foreground border border-border rounded px-2 py-0.5">{t}</span>
                ))}
              </div>
              <div className="mt-5 inline-flex items-center gap-1 text-sm text-[color:var(--brand)]">
                View case study <ArrowRight size={14}/>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </Section>
  );
}
