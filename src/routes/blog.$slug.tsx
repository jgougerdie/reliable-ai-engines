import type React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { getPost, listPosts } from "@/data/blog";
import { ArrowLeft, ArrowRight, AlertTriangle, Lightbulb, Download, Briefcase } from "lucide-react";
import { Mermaid } from "@/components/site/Mermaid";
import { DeterministicPipeline } from "@/components/site/DeterministicPipeline";

// Maps a figure image src (substring match) to a downloadable high-res PDF.
const DIAGRAM_PDF_MAP: Array<{ match: string; href: string; label: string }> = [
  {
    match: "llm-rag-architecture-diagram",
    href: "/diagrams/llm-rag-7-layer-architecture.pdf",
    label: "Download High-Res Architecture Diagram (PDF)",
  },
  {
    match: "production-ai-stages",
    href: "/diagrams/deterministic-document-pipeline.pdf",
    label: "Download High-Res Pipeline Diagram (PDF)",
  },
];

import type { BlogPost } from "@/data/blog";
export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }): { post: BlogPost } => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    const p = loaderData?.post;
    return {
      meta: [
        { title: p ? `${p.title} — Blog` : "Article" },
        { name: "description", content: p?.excerpt ?? "" },
        { property: "og:title", content: p?.title ?? "" },
        { property: "og:description", content: p?.excerpt ?? "" },
        { property: "og:type", content: "article" },
        { property: "og:url", content: p ? `/blog/${p.slug}` : "/blog" },
      ],
      links: p ? [{ rel: "canonical", href: `/blog/${p.slug}` }] : [],
      scripts: p ? [{
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: p.title,
          datePublished: p.date,
          articleSection: p.category,
          keywords: p.tags.join(", "),
        }),
      }] : [],
    };
  },
  component: PostPage,
  notFoundComponent: () => (
    <Section title="Article not found">
      <Link to="/blog" className="text-[color:var(--brand)]">← Back to blog</Link>
    </Section>
  ),
});

function PostPage() {
  const { post } = Route.useLoaderData() as { post: BlogPost };
  const related = listPosts({ category: post.category }).filter((p) => p.slug !== post.slug).slice(0, 3);
  

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 pt-12">
        <Link to="/blog" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft size={14}/> All articles
        </Link>
      </section>

      <article className="mx-auto max-w-3xl px-6 py-12">
        {post.slug === "llm-only-fails-engineering-extraction-what-works" ? (
          <DeterministicPipeline />
        ) : post.cover ? (
          <img
            src={post.cover}
            alt={post.title}
            width={1920}
            height={1080}
            className="mb-10 w-full rounded-xl border border-border"
          />
        ) : null}
        <span className="chip">{post.category}</span>
        <h1 className="mt-5 text-3xl md:text-5xl font-semibold tracking-tight leading-[1.1]">{post.title}</h1>
        <div className="mt-5 flex items-center gap-3 text-xs font-mono text-muted-foreground">
          <span>{new Date(post.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
          <span>·</span>
          <span>{post.readingMinutes} min read</span>
        </div>

        <div className="mt-10 space-y-5 text-[17px] leading-relaxed text-muted-foreground">
          {renderBlocks(post.content)}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <span key={t} className="text-[11px] font-mono text-muted-foreground border border-border rounded px-2 py-0.5">#{t}</span>
          ))}
        </div>
      </article>

      <section className="mx-auto max-w-3xl px-6 pb-20">
        <div className="rounded-2xl border border-border bg-[var(--surface)] p-8 md:p-10 text-center">
          <p className="text-lg md:text-xl font-medium text-foreground max-w-2xl mx-auto leading-snug">
            Building AI systems is easy. Building systems that survive production is harder.
          </p>
          <div className="mt-6">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium btn-primary"
            >
              Explore AI Architecture Services <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <Section eyebrow="Keep reading" title={`More in ${post.category}`}>
          <div className="grid md:grid-cols-3 gap-5">
            {related.map((p) => (
              <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="card-glow rounded-xl p-6">
                <h3 className="font-semibold leading-snug">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.excerpt}</p>
                <div className="mt-4 inline-flex items-center gap-1 text-sm text-[color:var(--brand)]">Read <ArrowRight size={14}/></div>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </>
  );
}

function inlineMd(s: string) {
  return s.replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground">$1</strong>');
}

function renderBlocks(content: string) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let i = 0;
  let key = 0;
  let firstPara = true;

  while (i < lines.length) {
    const line = lines[i];

    // Code fence
    if (line.trimStart().startsWith("```")) {
      const fenceLang = line.trimStart().slice(3).trim();
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      if (fenceLang === "mermaid") {
        blocks.push(<Mermaid key={key++} chart={codeLines.join("\n")} />);
        continue;
      }
      blocks.push(
        <pre key={key++} className="bg-[var(--surface)] border border-border rounded-lg p-4 overflow-x-auto text-[13px] leading-relaxed font-mono text-foreground/90">
          <code>{codeLines.join("\n")}</code>
        </pre>,
      );
      continue;
    }

    // Blank
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Heading
    if (line.startsWith("## ")) {
      blocks.push(
        <h2 key={key++} className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mt-14 pt-6 border-t border-border/60">{line.slice(3)}</h2>,
      );
      i++;
      continue;
    }

    if (line.startsWith("### ")) {
      blocks.push(
        <h3 key={key++} className="text-xl font-semibold tracking-tight text-foreground mt-8">{line.slice(4)}</h3>,
      );
      i++;
      continue;
    }

    // Blockquote (highlighted pull quote)
    if (line.startsWith("> ")) {
      const qLines: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        qLines.push(lines[i].slice(2));
        i++;
      }
      blocks.push(
        <blockquote
          key={key++}
          className="my-8 border-l-2 border-[color:var(--brand)] pl-6 py-2 text-xl md:text-2xl font-medium leading-snug text-foreground"
          dangerouslySetInnerHTML={{ __html: inlineMd(qLines.join(" ")) }}
        />,
      );
      continue;
    }

    // Callout: :::callout TYPE|Title  ... :::
    if (line.startsWith(":::callout")) {
      const header = line.slice(":::callout".length).trim();
      const [typeRaw, ...titleParts] = header.split("|");
      const type = (typeRaw || "info").trim();
      const title = titleParts.join("|").trim() || (type === "warn" ? "Common Failure Modes" : "Production Design Principle");
      const body: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith(":::")) {
        body.push(lines[i]);
        i++;
      }
      i++; // skip closing :::
      const isWarn = type === "warn";
      const Icon = isWarn ? AlertTriangle : Lightbulb;
      blocks.push(
        <aside
          key={key++}
          className={`my-8 rounded-xl border p-6 md:p-7 ${
            isWarn
              ? "border-amber-500/30 bg-amber-500/[0.04]"
              : "border-[color:var(--brand)]/30 bg-[color:var(--brand)]/[0.04]"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <Icon size={16} className={isWarn ? "text-amber-400" : "text-[color:var(--brand)]"} />
            <span className={`text-[11px] font-mono uppercase tracking-wider ${isWarn ? "text-amber-400" : "text-[color:var(--brand)]"}`}>
              {title}
            </span>
          </div>
          <div className="space-y-3 text-[15px] leading-relaxed text-foreground/90">
            {renderBlocks(body.join("\n"))}
          </div>
        </aside>,
      );
      continue;
    }

    // Figure: ![caption](src)
    const figMatch = line.match(/^!\[(.*?)\]\((.+?)\)\s*$/);
    if (figMatch) {
      const caption = figMatch[1];
      const src = figMatch[2];
      i++;
      blocks.push(
        <figure key={key++} className="my-10">
          <div className="rounded-xl border border-border bg-[var(--surface)] p-2">
            <img src={src} alt={caption} loading="lazy" className="w-full rounded-lg" />
          </div>
          {caption && (
            <figcaption className="mt-3 text-center text-xs font-mono text-muted-foreground">
              {caption}
            </figcaption>
          )}
        </figure>,
      );
      continue;
    }

    // Unordered list
    if (/^\s*-\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*-\s+/, ""));
        i++;
      }
      blocks.push(
        <ul key={key++} className="list-disc pl-6 space-y-2">
          {items.map((it, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inlineMd(it) }} />
          ))}
        </ul>,
      );
      continue;
    }

    // Ordered list
    if (/^\s*\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*\d+\.\s+/, ""));
        i++;
      }
      blocks.push(
        <ol key={key++} className="list-decimal pl-6 space-y-2">
          {items.map((it, j) => (
            <li key={j} dangerouslySetInnerHTML={{ __html: inlineMd(it) }} />
          ))}
        </ol>,
      );
      continue;
    }

    // Paragraph: collect until blank or block-starter
    const paraLines: string[] = [line];
    i++;
    while (i < lines.length) {
      const l = lines[i];
      if (
        l.trim() === "" ||
        l.startsWith("## ") ||
        l.startsWith("### ") ||
        l.startsWith("> ") ||
        l.startsWith(":::") ||
        l.trimStart().startsWith("```") ||
        /^!\[.*?\]\(.+?\)\s*$/.test(l) ||
        /^\s*-\s+/.test(l) ||
        /^\s*\d+\.\s+/.test(l)
      ) break;
      paraLines.push(l);
      i++;
    }
    const text = paraLines.join(" ");
    blocks.push(
      <p
        key={key++}
        className={firstPara ? "text-foreground/90 text-lg" : ""}
        dangerouslySetInnerHTML={{ __html: inlineMd(text) }}
      />,
    );
    firstPara = false;
  }

  return blocks;
}

