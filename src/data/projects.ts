import agentsImg from "@/assets/project-agents.jpg";
import docsImg from "@/assets/project-docs.jpg";
import ragImg from "@/assets/project-rag.jpg";

export type Project = {
  slug: string;
  title: string;
  role: string;
  summary: string;
  description: string;
  impact: string;
  technologies: string[];
  image: string;
  architecture: {
    title: string;
    steps: { name: string; description: string }[];
  };
  features: string[];
  relatedBlogSlug?: string;
};

export const projects: Project[] = [
  {
    slug: "autonomous-ai-agent-sales-automation",
    title: "Autonomous AI Agent System for Sales & Workflow Automation",
    role: "Lead AI Architect",
    summary:
      "Multi-agent system that autonomously researches, enriches, scores, and engages B2B leads.",
    description:
      "Designed and built a multi-agent AI system to automate sales and operational workflows for a growing B2B company. The system uses autonomous agents for lead research, data enrichment, lead scoring, and personalized outreach generation, orchestrated through a stateful workflow architecture with built-in validation and self-correction.",
    impact: "Reduced manual workload by ~70% across the SDR and operations teams.",
    technologies: ["Python", "LangChain", "LangGraph", "OpenAI", "PostgreSQL", "Redis"],
    image: agentsImg,
    architecture: {
      title: "Stateful Multi-Agent Workflow",
      steps: [
        { name: "Lead Research Agent", description: "Pulls signals from web, CRM, and enrichment APIs." },
        { name: "Enrichment Pipeline", description: "Normalizes and validates firmographic + persona data." },
        { name: "Scoring Engine", description: "LLM + heuristic hybrid scoring with explainability." },
        { name: "Outreach Generator", description: "Personalized multi-channel sequences with guardrails." },
        { name: "Validation Loop", description: "Self-correction layer rejects low-confidence outputs." },
      ],
    },
    features: [
      "Stateful workflow orchestration with LangGraph",
      "Self-correcting agents with critique loops",
      "Cost-aware model routing across providers",
      "Full observability and replayability",
    ],
    relatedBlogSlug: "designing-stateful-multi-agent-systems",
  },
  {
    slug: "ai-document-processing-platform",
    title: "AI Document Processing & Intelligent Data Extraction Platform",
    role: "AI Solutions Architect",
    summary:
      "Production document AI for logistics: OCR + LLM interpretation + structured extraction at scale.",
    description:
      "Built an AI-powered document processing platform for logistics workflows, combining OCR pipelines, LLM interpretation, validation workflows, structured extraction, and direct enterprise system integrations.",
    impact:
      "Cut manual processing time substantially and dramatically improved retrieval of operational information.",
    technologies: ["Python", "OCR", "OpenAI", "FastAPI", "PostgreSQL", "Docker"],
    image: docsImg,
    architecture: {
      title: "Document Intelligence Pipeline",
      steps: [
        { name: "Ingestion", description: "Multi-format intake (PDF, scans, images, emails)." },
        { name: "OCR Layer", description: "Layout-aware OCR with table and field detection." },
        { name: "LLM Interpretation", description: "Schema-guided extraction with confidence scoring." },
        { name: "Validation Workflow", description: "Rule + LLM-based validation, human-in-the-loop for edge cases." },
        { name: "Enterprise Integration", description: "Streaming output to ERP, TMS, and warehouse systems." },
      ],
    },
    features: [
      "Schema-first structured extraction",
      "Confidence-based human-in-the-loop routing",
      "Horizontal scaling with queue-backed workers",
      "End-to-end audit trail",
    ],
    relatedBlogSlug: "production-rag-pitfalls",
  },
  {
    slug: "enterprise-rag-knowledge-assistant",
    title: "Enterprise AI Assistant for Internal Knowledge Search",
    role: "AI Architect & Generative AI Consultant",
    summary:
      "Secure internal RAG assistant unifying Notion, Drive, and support systems into one semantic layer.",
    description:
      "Designed a secure internal knowledge assistant using RAG pipelines and vector search, integrating fragmented knowledge across Notion, Google Drive, and support systems with metadata filtering, vector search, and natural language retrieval.",
    impact: "Reduced internal search time and significantly improved onboarding efficiency.",
    technologies: ["Python", "LangChain", "Pinecone", "OpenAI", "FastAPI"],
    image: ragImg,
    architecture: {
      title: "Federated RAG Architecture",
      steps: [
        { name: "Source Connectors", description: "Incremental sync from Notion, Drive, Zendesk, and more." },
        { name: "Chunking & Embeddings", description: "Semantic chunking with metadata-rich vectors." },
        { name: "Vector Search", description: "Pinecone with hybrid + metadata filtering." },
        { name: "Retrieval Orchestrator", description: "Query rewriting, multi-step retrieval, reranking." },
        { name: "Conversational Layer", description: "Grounded answers with citations and access control." },
      ],
    },
    features: [
      "Row-level access control mirroring source permissions",
      "Hybrid semantic + keyword retrieval",
      "Inline citations with source previews",
      "Continuous evaluation harness",
    ],
    relatedBlogSlug: "production-rag-pitfalls",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
