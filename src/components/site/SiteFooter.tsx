import { Link } from "@tanstack/react-router";
import { Youtube } from "lucide-react";
import { YOUTUBE_CHANNEL_URL } from "@/data/videoProjects";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[var(--surface-elevated)]">
              <span className="font-serif text-sm font-semibold tracking-tight text-foreground">JG</span>
            </span>
            <span className="leading-tight">
              <span className="block text-sm font-semibold tracking-tight">Javad Gougerdie</span>
              <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                Video Editor · Post-Production
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Cinematic editing, motion graphics, visual effects and design — every frame with a
            purpose. All work shown on this site is real, watchable, and sourced from my own
            channel.
          </p>
          <div className="mt-5 flex gap-3">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube channel"
              className="p-2 rounded-md btn-ghost"
            >
              <Youtube size={16} />
            </a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-foreground">Home</Link></li>
            <li><Link to="/work" className="hover:text-foreground">Work</Link></li>
            <li><Link to="/story" className="hover:text-foreground">Story</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/videos" className="hover:text-foreground">Video library</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">More</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-foreground">Start a project</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/ai" className="hover:text-foreground">AI site</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Javad Gougerdie — Video Editor & Post-Production.</span>
          <span className="font-mono">Every frame has a purpose.</span>
        </div>
      </div>
    </footer>
  );
}
