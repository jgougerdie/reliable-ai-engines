import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

const StoryExperience = lazy(() => import("../components/story/StoryExperience"));

export const Route = createFileRoute("/story")({
  head: () => ({
    meta: [
      { title: "Architect.systems — A 3D Story of Production AI" },
      {
        name: "description",
        content:
          "An immersive 3D storytelling experience for Architect.systems: retrieval, reasoning, agents, and delivery — engineered for production.",
      },
      { property: "og:title", content: "Architect.systems — A 3D Story" },
      {
        property: "og:description",
        content: "Scroll through a cinematic journey of production-grade LLM, RAG, and agent systems.",
      },
    ],
  }),
  component: StoryPage,
});

function StoryPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05070d] text-white">
        <p className="font-serif italic text-white/60">Loading experience…</p>
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#05070d] text-white">
          <p className="font-serif italic text-white/60">Preparing scene…</p>
        </div>
      }
    >
      <StoryExperience />
    </Suspense>
  );
}
