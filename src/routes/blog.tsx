import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { Section } from "@/components/site/Section";
import { BLOG_CATEGORIES, listPosts, posts, type BlogCategory } from "@/data/blog";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Production AI, RAG, LLMs & Agents" },
      { name: "description", content: "Field notes on production AI: agents, RAG systems, LLM engineering, AI architecture, and case studies." },
      { property: "og:title", content: "Blog — AI Architect" },
      { property: "og:description", content: "Practical writing on production AI systems." },
      { property: "og:url", content: "/blog" },
    ],
    links: [{ rel: "canonical", href: "/blog" }],
  }),
  component: BlogLayout,
});

const PAGE_SIZE = 6;

function BlogLayout() {
  const matches = useMatches();
  const isChild = matches.some((m) => m.routeId === "/blog/$slug");
  if (isChild) return <Outlet />;
  return <BlogIndex />;
}

function BlogIndex() {
  const [category, setCategory] = useState<BlogCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);

  const featured = posts.filter((p) => p.featured)[0];
  const filtered = useMemo(
    () => listPosts({
      category: category === "All" ? undefined : category,
      query: query || undefined,
    }),
    [category, query],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Section
      eyebrow="Blog"
      title="Field notes on production AI"
      description="Writing on agents, RAG, LLM engineering, and the architecture decisions that make systems hold up at scale."
    >
      {/* Featured */}
      {featured && (
        <Link to="/blog/$slug" params={{ slug: featured.slug }} className="block card-glow rounded-2xl p-8 md:p-10 mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="chip">Featured</span>
            <span className="text-xs text-muted-foreground font-mono">{featured.category}</span>
          </div>
          <h3 className="mt-4 text-2xl md:text-3xl font-semibold leading-tight max-w-3xl">{featured.title}</h3>
          <p className="mt-4 text-muted-foreground max-w-2xl">{featured.excerpt}</p>
          <div className="mt-5 text-xs font-mono text-muted-foreground">{new Date(featured.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {featured.readingMinutes} min read</div>
        </Link>
      )}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between mb-8">
        <div className="flex flex-wrap gap-2">
          {["All", ...BLOG_CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c as BlogCategory | "All"); setPage(1); }}
              className={`px-3 py-1.5 rounded-full text-xs font-mono border transition ${
                category === c
                  ? "bg-gradient-to-r from-[var(--brand)]/30 to-[var(--brand-violet)]/30 border-[color:var(--brand)]/50 text-foreground"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="relative md:w-72">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"/>
          <input
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            placeholder="Search articles…"
            className="w-full pl-9 pr-3 py-2 rounded-md bg-[var(--surface)] border border-border text-sm placeholder:text-muted-foreground focus:outline-none focus:border-[color:var(--brand)]/60"
          />
        </div>
      </div>

      {/* Grid */}
      {pageItems.length === 0 ? (
        <p className="text-muted-foreground">No articles match your filters yet.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {pageItems.map((p) => (
            <Link key={p.slug} to="/blog/$slug" params={{ slug: p.slug }} className="card-glow rounded-xl p-6 flex flex-col">
              <span className="chip self-start">{p.category}</span>
              <h3 className="mt-4 text-lg font-semibold leading-snug">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground flex-1">{p.excerpt}</p>
              <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
                <span>{new Date(p.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                <span>{p.readingMinutes} min</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`h-9 w-9 rounded-md text-sm font-mono border ${
                page === i + 1 ? "border-[color:var(--brand)] text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </Section>
  );
}
