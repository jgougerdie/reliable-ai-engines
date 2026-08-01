import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { LandingChat } from "@/components/landing/LandingChat";

const LandingScene3D = lazy(() => import("@/components/landing/LandingScene3D"));

function Scene3DLayer() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="pointer-events-none absolute inset-0">
      <Suspense fallback={null}>
        <LandingScene3D />
      </Suspense>
    </div>
  );
}

/** Headline with pointer-driven 3D tilt, layered depth and a gentle float. */
function Headline3D() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const cy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      setT({ rx: Math.max(-1, Math.min(1, cy)) * -8, ry: Math.max(-1, Math.min(1, cx)) * 12 });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="mt-6 [perspective:1000px]">
      <h1
        ref={ref}
        className="headline-float relative font-serif text-5xl leading-[1.02] tracking-tight text-white transition-transform duration-300 ease-out will-change-transform sm:text-6xl lg:text-7xl"
        style={{
          transform: `rotateX(${t.rx}deg) rotateY(${t.ry}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Depth echo */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 select-none text-[color:var(--brand)] opacity-30 blur-[2px]"
          style={{ transform: "translateZ(-40px) translate(6px, 6px)" }}
        >
          Production AI, <span className="italic">answered live.</span>
        </span>
        <span className="relative block" style={{ transform: "translateZ(45px)" }}>
          Production AI,{" "}
          <span
            className="italic text-white/85"
            style={{ transform: "translateZ(25px)", display: "inline-block" }}
          >
            answered live.
          </span>
        </span>
      </h1>
    </div>
  );
}




export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Architect.systems — Production AI, Answered Live" },
      {
        name: "description",
        content:
          "The consulting practice of a senior AI Architect. Ask the on-site assistant about services and case studies, or step inside the full site.",
      },
      { property: "og:title", content: "Architect.systems — Production AI, Answered Live" },
      {
        property: "og:description",
        content: "LLM, RAG, and agent systems engineered for production. Talk to the on-site AI or enter the site.",
      },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#05070d] text-white">
      {/* Ambient background */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 20% 15%, rgba(106,168,255,0.18), transparent 60%), radial-gradient(ellipse 50% 40% at 85% 85%, rgba(180,123,255,0.16), transparent 60%), radial-gradient(ellipse 80% 60% at 50% 100%, rgba(10,20,50,0.7), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />

      {/* 3D scene */}
      <Scene3DLayer />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 30% 45%, rgba(5,7,13,0.82), rgba(5,7,13,0.35) 55%, transparent 75%)",
        }}
      />



      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col px-6 py-8">
        {/* Top bar */}
        <header className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="relative inline-flex h-8 w-8 items-center justify-center rounded-md bg-gradient-to-br from-[var(--brand)] to-[var(--brand-violet)] shadow-[0_0_28px_-4px_var(--brand)]">
              <span className="font-mono text-[11px] font-bold text-white">AI</span>
            </span>
            <span className="font-semibold tracking-tight">
              <span className="text-white">Architect</span>
              <span className="text-white/50">.systems</span>
            </span>
          </Link>
          <Link
            to="/home"
            className="group inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2 text-xs font-medium tracking-wide text-white/80 transition hover:border-white/40 hover:bg-white/[0.06] hover:text-white"
          >
            Enter site
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </header>

        {/* Hero + Chat */}
        <section className="grid flex-1 grid-cols-1 items-center gap-12 py-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16 lg:py-20">
          {/* Left — pitch */}
          <div className="flex flex-col">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white/60">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
              Available for Q3 2026
            </span>

            <Headline3D />


            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/70">
              A senior AI Architect for LLM, RAG, and multi-agent systems that survive production.
              Ask the on-site assistant about services and case studies — or step inside.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/home"
                className="group inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-[var(--brand)] to-[var(--brand-violet)] px-5 py-3 text-sm font-medium text-white shadow-[0_10px_40px_-10px_rgba(106,168,255,0.7)] transition hover:opacity-95"
              >
                Enter the full site
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/portfolio"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
              >
                View case studies
              </Link>
            </div>

            <dl className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-6">
              {[
                { k: "8+", v: "yrs shipping AI" },
                { k: "LLM · RAG", v: "· Agents" },
                { k: "AWS", v: "production" },
              ].map((s) => (
                <div key={s.v}>
                  <dt className="font-serif text-2xl text-white">{s.k}</dt>
                  <dd className="mt-1 text-[11px] uppercase tracking-wider text-white/45">{s.v}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Right — Chat */}
          <div className="flex justify-center lg:justify-end">
            <LandingChat />
          </div>
        </section>

        {/* Footer hint */}
        <footer className="flex flex-col items-center gap-2 pb-4 pt-8 text-center text-[11px] uppercase tracking-[0.3em] text-white/35">
          <span>Scroll or press "Enter site" to explore</span>
        </footer>
      </div>
    </main>
  );
}
