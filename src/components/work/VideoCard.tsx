import { Play } from "lucide-react";
import { posterFor, youtubeId, type VideoProject } from "@/data/videoProjects";

export function VideoCard({
  project,
  onOpen,
  size = "default",
}: {
  project: VideoProject;
  onOpen: (p: VideoProject) => void;
  size?: "default" | "large";
}) {
  const poster = posterFor(project);
  const id = youtubeId(project.youtubeUrl);
  return (
    <button
      type="button"
      onClick={() => onOpen(project)}
      aria-label={`Play ${project.title}`}
      className="group block w-full text-left"
    >
      <div className="relative overflow-hidden rounded-xl border border-border bg-[var(--surface)]">
        <div className={size === "large" ? "aspect-[16/9]" : "aspect-[16/9]"}>
          {poster ? (
            <img
              src={poster}
              alt={`${project.title} — still frame`}
              loading="lazy"
              decoding="async"
              onError={(e) => {
                const el = e.currentTarget;
                if (id && !el.dataset.fallback) {
                  el.dataset.fallback = "1";
                  el.src = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
                }
              }}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="h-full w-full bg-[var(--surface-elevated)]" />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/85 via-background/10 to-transparent opacity-90" />
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-background/40 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:border-white/50">
            <Play size={18} className="translate-x-[1px] text-foreground" />
          </span>
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4 sm:p-5">
          <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            <span>{project.category}</span>
            {project.year ? <span aria-hidden>·</span> : null}
            {project.year ? <span>{project.year}</span> : null}
          </div>
          <h3
            className={
              size === "large"
                ? "mt-1.5 font-serif text-2xl sm:text-3xl leading-tight"
                : "mt-1.5 font-serif text-xl leading-tight"
            }
          >
            {project.title}
          </h3>
        </div>
      </div>
      {project.description ? (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>
      ) : null}
    </button>
  );
}
