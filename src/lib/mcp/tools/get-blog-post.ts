import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { blogPosts } from "@/data/blog";

export default defineTool({
  name: "get_blog_post",
  title: "Get blog post",
  description: "Get the full content of a single blog post on Architect.systems by slug.",
  inputSchema: {
    slug: z.string().min(1).describe("Blog post slug (from list_blog_posts)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) {
      return {
        content: [{ type: "text", text: `No blog post found with slug "${slug}".` }],
        isError: true,
      };
    }
    const { cover: _cover, ...rest } = post;
    const payload = { ...rest, url: `/blog/${post.slug}` };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: { post: payload },
    };
  },
});
