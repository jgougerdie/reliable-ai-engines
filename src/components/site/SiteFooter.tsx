import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Briefcase } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-border">
      <div className="mx-auto max-w-7xl px-6 py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-[var(--brand)] to-[var(--brand-violet)]">
              <span className="font-mono text-[11px] font-bold text-white">AI</span>
            </span>
            <span className="font-semibold">Architect.systems</span>
          </div>
          <p className="mt-4 max-w-md text-sm text-muted-foreground">
            Production-grade AI systems — LLMs, RAG, agents, and automation —
            designed to operate reliably at scale.
          </p>
          <div className="mt-5 flex gap-3">
            <a href="https://github.com/" aria-label="GitHub" className="p-2 rounded-md btn-ghost"><Github size={16}/></a>
            <a href="https://linkedin.com/" aria-label="LinkedIn" className="p-2 rounded-md btn-ghost"><Linkedin size={16}/></a>
            <a href="https://upwork.com/" aria-label="Upwork" className="p-2 rounded-md btn-ghost"><Briefcase size={16}/></a>
          </div>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/services" className="hover:text-foreground">Services</Link></li>
            <li><Link to="/portfolio" className="hover:text-foreground">Portfolio</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Engage</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Book a consultation</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} Architect.systems — AI systems consulting.</span>
          <span className="font-mono">Production-grade AI · Built for scale</span>
        </div>
      </div>
    </footer>
  );
}
