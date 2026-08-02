import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listBlogPosts from "./tools/list-blog-posts";
import getBlogPost from "./tools/get-blog-post";
import listPortfolioProjects from "./tools/list-portfolio-projects";
import getPortfolioProject from "./tools/get-portfolio-project";
import listServices from "./tools/list-services";

const projectRef = import.meta.env['VITE_SUPABASE_PROJECT_ID'] ?? "project-ref-unset";

export default defineMcp({
  name: "architect-systems-mcp",
  title: "Architect.systems",
  version: "0.1.0",
  instructions:
    "Read-only access to public content on Architect.systems: blog posts on AI architecture, RAG, and agents; portfolio case studies; and the consulting service catalog. Use list_* tools to discover items, then get_* tools to fetch full content by slug.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listBlogPosts, getBlogPost, listPortfolioProjects, getPortfolioProject, listServices],
});
