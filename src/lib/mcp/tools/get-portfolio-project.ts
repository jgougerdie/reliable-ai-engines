import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { getProject } from "@/data/projects";

export default defineTool({
  name: "get_portfolio_project",
  title: "Get portfolio project",
  description: "Get the full case study for a portfolio project on Architect.systems by slug.",
  inputSchema: {
    slug: z.string().min(1).describe("Project slug (from list_portfolio_projects)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slug }) => {
    const p = getProject(slug);
    if (!p) {
      return {
        content: [{ type: "text", text: `No portfolio project found with slug "${slug}".` }],
        isError: true,
      };
    }
    const { image: _image, ...rest } = p;
    const payload = { ...rest, url: `/portfolio/${p.slug}` };
    return {
      content: [{ type: "text", text: JSON.stringify(payload, null, 2) }],
      structuredContent: { project: payload },
    };
  },
});
