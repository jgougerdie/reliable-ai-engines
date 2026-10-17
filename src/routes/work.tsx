import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Section } from "@/components/site/Section";
import { VideoCard } from "@/components/work/VideoCard";
import { VideoLightbox } from "@/components/work/VideoLightbox";
import { videoProjects, workCategories, type VideoProject } from "@/data/videoProjects";

export const Route = createFileRoute("/work")({
  head: () => ({
    meta: [
      { title: "Work — Javad Gougerdie, Video Editor" },
      {
        name: "description",
        content:
          "Selected editing, motion graphics, visual effects and design work by Javad Gougerdie — real projects, watchable in full.",
      },
      { property: "og:title", content: "Work — Javad Gougerdie, Video Editor" },
      {
        property: "og:description",
        content: "Cinematic, motion graphics, VFX and design work — filter by discipline and watch.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/work" }],
  }),
  component: WorkPage,
});

function WorkPage() {
  const [category, setCategory] = useState<string>("All");
  const [active, setActive] = useState<VideoProject | null>(null);

  const filtered =
    category === "All"
      ? videoProjects
      : videoProjects.filter((p) => p.category === category);

  return (
    <Section
      eyebrow="Work"
      titleAs="h1"
      title="Every project, watchable in full"
      description="Real work from my channel — cinematic edits, motion design, effects and scene studies. Filter by discipline, click any frame to play."
    >
      <VideoLightbox project={active} onClose={() => setActive(null)} />

      <div className="mb-8 flex flex-wrap gap-2">
        {workCategories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            aria-pressed={category === c}
            className={
              category === c
                ? "btn-primary rounded-full px-4 py-2 text-sm font-medium"
                : "btn-ghost rounded-full px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            }
          >
            {c}
          </button>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <VideoCard key={p.title} project={p} onOpen={setActive} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          Nothing in this category yet.
        </p>
      ) : null}
    </Section>
  );
}
