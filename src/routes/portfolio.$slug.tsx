import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { getProject, projects } from "@/data/projects";
import { getPost } from "@/data/blog";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";

import type { Project } from "@/data/projects";
export const Route = createFileRoute("/portfolio/$slug")({
  loader: ({ params }): { project: Project } => {
    const project = getProject(params.slug);
    if (!project) throw notFound();
    return { project };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.project;
    return {
      meta: [
        { title: p ? `${p.title} — Case Study` : "Case Study" },
        { name: "description", content: p?.summary ?? "" },
        { property: "og:title", content: p?.title ?? "" },
        { property: "og:description", content: p?.summary ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:url", content: p ? `/portfolio/${p.slug}` : "/portfolio" },
        { property: "og:image", content: p?.image ?? "" },
      ],
      links: p ? [{ rel: "canonical", href: `/portfolio/${p.slug}` }] : [],
    };
  },
  component: ProjectPage,
  notFoundComponent: () => (
    <Section title="Project not found">
      <Link to="/portfolio" className="text-[color:var(--brand)]">← Back to portfolio</Link>
    </Section>
  ),
});

function ProjectPage() {
  const { project } = Route.useLoaderData();
  const related = project.relatedBlogSlug ? getPost(project.relatedBlogSlug) : undefined;
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  return (
    <>
      <section className="mx-auto max-w-7xl px-6 pt-12">
        <Link to="/portfolio" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14}/> All projects
        </Link>
      </section>

      <Section
        eyebrow={project.role}
        title={project.title}
        description={project.summary}
      >
        <div className="card-glow rounded-2xl overflow-hidden">
          <img src={project.image} alt={project.title} width={1600} height={1000} className="w-full h-auto"/>
        </div>

        <div className="mt-12 grid lg:grid-cols-[1.4fr_1fr] gap-12">
          <article className="space-y-10">
            <div>
              <h2 className="text-2xl font-semibold">Overview</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{project.description}</p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">{project.architecture.title}</h2>
              <ol className="mt-6 space-y-3">
                {project.architecture.steps.map((s, i) => (
                  <li key={s.name} className="card-glow rounded-xl p-5 flex gap-4">
                    <span className="font-mono text-sm text-[color:var(--brand)] mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{s.description}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">Key capabilities</h2>
              <ul className="mt-4 grid sm:grid-cols-2 gap-3">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <CheckCircle2 size={16} className="text-[color:var(--brand)] mt-0.5 shrink-0"/>{f}
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <aside className="space-y-5 lg:sticky lg:top-24 self-start">
            <div className="card-glow rounded-2xl p-6">
              <div className="text-xs font-mono text-muted-foreground">Business Impact</div>
              <p className="mt-2 text-lg leading-snug">{project.impact}</p>
            </div>
            <div className="card-glow rounded-2xl p-6">
              <div className="text-xs font-mono text-muted-foreground">Stack</div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {project.technologies.map((t) => (
                  <span key={t} className="text-[11px] font-mono text-muted-foreground border border-border rounded px-2 py-0.5">{t}</span>
                ))}
              </div>
            </div>
            {related && (
              <Link to="/blog/$slug" params={{ slug: related.slug }} className="card-glow rounded-2xl p-6 block">
                <div className="text-xs font-mono text-[color:var(--brand)]">Related article</div>
                <div className="mt-2 font-semibold leading-snug">{related.title}</div>
                <div className="mt-3 inline-flex items-center gap-1 text-sm text-[color:var(--brand)]">Read <ArrowRight size={14}/></div>
              </Link>
            )}
          </aside>
        </div>
      </Section>

      <Section eyebrow="More work" title="Other production AI systems">
        <div className="grid md:grid-cols-2 gap-6">
          {others.map((p) => (
            <Link key={p.slug} to="/portfolio/$slug" params={{ slug: p.slug }} className="card-glow rounded-2xl overflow-hidden group">
              <div className="relative aspect-[16/9]">
                <img src={p.image} alt={p.title} loading="lazy" width={1600} height={900} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"/>
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-semibold">{p.title}</h3>
                <p className="text-sm text-muted-foreground mt-2">{p.summary}</p>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </>
  );
}
