import { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { youtubeId, posterFor, type VideoProject } from "@/data/videoProjects";

export function VideoLightbox({
  project,
  onClose,
}: {
  project: VideoProject | null;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [project, onClose]);

  if (!project) return null;
  const id = youtubeId(project.youtubeUrl);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={project.title}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 p-4 backdrop-blur-md"
      onClick={onClose}
    >
      <div
        className="w-full max-w-5xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 pb-3">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {project.category}
              {project.year ? ` · ${project.year}` : ""}
            </div>
            <h2 className="font-serif text-2xl">{project.title}</h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close video"
            className="rounded-md p-2 btn-ghost"
          >
            <X size={18} />
          </button>
        </div>

        <div className="overflow-hidden rounded-xl border border-border bg-black">
          <div className="aspect-video w-full">
            {project.videoUrl ? (
              <video
                src={project.videoUrl}
                poster={posterFor(project)}
                controls
                autoPlay
                playsInline
                className="h-full w-full"
              />
            ) : id ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="h-full w-full"
              />
            ) : null}
          </div>
        </div>

        {project.youtubeUrl ? (
          <a
            href={project.youtubeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            Open on YouTube <ExternalLink size={14} />
          </a>
        ) : null}
      </div>
    </div>
  );
}
