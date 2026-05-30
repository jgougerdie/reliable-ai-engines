import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { getPost, listPosts } from "@/data/blog";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
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
  const { post } = Route.useLoaderData();
  const related = listPosts({ category: post.category }).filter((p) => p.slug !== post.slug).slice(0, 3);
  const paragraphs = post.content.split(/\n\n+/);

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
          {paragraphs.map((p, i) => (
            <p key={i} className={i === 0 ? "text-foreground/90 text-lg" : ""}>{p}</p>
          ))}
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
