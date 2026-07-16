import { defineTool } from "@lovable.dev/mcp-js";
import { projects } from "@/data/projects";

export default defineTool({
  name: "list_portfolio_projects",
  title: "List portfolio projects",
  description:
    "List case studies / portfolio projects on Architect.systems (title, role, summary, impact, technologies).",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const rows = projects.map((p) => ({
      slug: p.slug,
      title: p.title,
      role: p.role,
      summary: p.summary,
      impact: p.impact,
      technologies: p.technologies,
      url: `/portfolio/${p.slug}`,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { projects: rows },
    };
  },
});
