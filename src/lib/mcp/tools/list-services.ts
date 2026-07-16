import { defineTool } from "@lovable.dev/mcp-js";

const services = [
  {
    title: "AI Architecture",
    description:
      "End-to-end system design with explicit state, deterministic orchestration, and observability baked in.",
    bullets: ["Reference architectures", "Tech selection & trade-offs", "Roadmaps and de-risking plans"],
  },
  {
    title: "LLM Applications",
    description: "OpenAI, Claude, Llama, and bespoke APIs woven into real product surfaces.",
    bullets: ["Structured outputs", "Prompt engineering & evaluation", "Streaming, tool use, function calling"],
  },
  {
    title: "RAG Systems",
    description:
      "Federated retrieval over fragmented enterprise knowledge — grounded, secure, and current.",
    bullets: ["Hybrid retrieval + reranking", "Permission-aware indexes", "Continuous evaluation harness"],
  },
  {
    title: "AI Agents",
    description: "Stateful, validated, cost-aware multi-agent systems that hold up under real workloads.",
    bullets: ["LangGraph orchestration", "Critique & self-correction loops", "Replayable execution traces"],
  },
  {
    title: "Workflow Automation",
    description: "Operational AI woven into CRMs, ERPs, ticketing, and back-office systems.",
    bullets: ["Process discovery", "Human-in-the-loop design", "ROI tracking & rollouts"],
  },
  {
    title: "Cloud Deployment",
    description: "AWS, Azure, GCP, Docker — productionized with cost, latency, and reliability budgets.",
    bullets: ["Infra as code", "Observability stack", "Scaling & cost controls"],
  },
];

export default defineTool({
  name: "list_services",
  title: "List services",
  description: "List the consulting services offered on Architect.systems.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(services, null, 2) }],
    structuredContent: { services },
  }),
});
