import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/", label: "Home" },
  { to: "/work", label: "Work" },
  { to: "/story", label: "Story" },
  { to: "/contact", label: "Contact" },
];

export function SiteNav() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 glass">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-[var(--surface-elevated)] shadow-[0_0_24px_-8px_var(--brand)]">
            <span className="font-serif text-sm font-semibold tracking-tight text-foreground">JG</span>
          </span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold tracking-tight text-foreground">
              Javad Gougerdie
            </span>
            <span className="block text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              Video Editor · Post-Production
            </span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="px-3 py-2 text-sm text-muted-foreground rounded-md hover:text-foreground hover:bg-[var(--surface)] transition-colors"
              activeProps={{ className: "text-foreground bg-[var(--surface)]" }}
              activeOptions={{ exact: l.to === "/" }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="ml-2 inline-flex items-center rounded-md px-4 py-2 text-sm font-medium btn-primary"
          >
            Start a project
          </Link>
        </nav>
        <button
          className="md:hidden p-2 rounded-md btn-ghost"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-[var(--surface)]/80 backdrop-blur">
          <div className="px-6 py-3 flex flex-col gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-muted-foreground hover:text-foreground"
                activeProps={{ className: "text-foreground" }}
                activeOptions={{ exact: l.to === "/" }}
              >
                {l.label}
              </Link>
            ))}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium"
            >
              Start a project
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
