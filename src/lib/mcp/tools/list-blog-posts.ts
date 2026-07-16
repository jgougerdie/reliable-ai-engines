import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { posts as blogPosts, BLOG_CATEGORIES } from "@/data/blog";

export default defineTool({
  name: "list_blog_posts",
  title: "List blog posts",
  description:
    "List blog posts on Architect.systems (title, slug, excerpt, category, tags, date, reading time). Optionally filter by category or tag.",
  inputSchema: {
    category: z
      .enum(BLOG_CATEGORIES as [string, ...string[]])
      .optional()
      .describe("Filter by blog category."),
    tag: z.string().optional().describe("Filter by tag (case-insensitive)."),
    limit: z.number().int().min(1).max(100).optional().describe("Max results (default 50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, tag, limit }) => {
    let posts = blogPosts.slice();
    if (category) posts = posts.filter((p) => p.category === category);
    if (tag) {
      const t = tag.toLowerCase();
      posts = posts.filter((p) => p.tags.some((x) => x.toLowerCase() === t));
    }
    posts = posts.slice(0, limit ?? 50);
    const rows = posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      category: p.category,
      tags: p.tags,
      date: p.date,
      readingMinutes: p.readingMinutes,
      url: `/blog/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { posts: rows },
    };
  },
});
