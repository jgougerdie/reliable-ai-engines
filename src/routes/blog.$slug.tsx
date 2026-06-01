import type React from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { getPost, listPosts } from "@/data/blog";
import { ArrowLeft, ArrowRight } from "lucide-react";

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
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].trimStart().startsWith("```")) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
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
        <h2 key={key++} className="text-2xl font-semibold tracking-tight text-foreground mt-10">{line.slice(3)}</h2>,
      );
      i++;
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
      if (l.trim() === "" || l.startsWith("## ") || l.trimStart().startsWith("```") || /^\s*-\s+/.test(l) || /^\s*\d+\.\s+/.test(l)) break;
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

