import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowUpRight, Play, Youtube } from "lucide-react";
import { VideoCard } from "@/components/work/VideoCard";
import { VideoLightbox } from "@/components/work/VideoLightbox";
import {
  featuredProjects,
  showreel,
  posterFor,
  YOUTUBE_CHANNEL_URL,
  videoProjects,
  type VideoProject,
} from "@/data/videoProjects";

export const Route = createFileRoute("/")({
  head: () => {
    const poster = posterFor(showreel);
    return {
      meta: [
        { title: "Javad Gougerdie — Video Editor & Post-Production" },
        {
          name: "description",
          content:
            "Portfolio of Javad Gougerdie: cinematic editing, motion graphics, visual effects and design. Every frame has a purpose.",
        },
        { property: "og:title", content: "Javad Gougerdie — Video Editor & Post-Production" },
        {
          property: "og:description",
          content:
            "Cinematic editing, motion graphics, VFX and design — watch the showreel and selected work.",
        },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        ...(poster
          ? [
              { property: "og:image", content: poster },
              { name: "twitter:image", content: poster },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: "/" }],
    };
  },
  component: Home,
});

const services = [
  {
    title: "Cinematic Editing",
    desc: "Dialogue-led cuts, long-held framing and pacing that keeps the subject — not the edit — in focus.",
  },
  {
    title: "Motion Graphics",
    desc: "Type, easing and layout choreography built as a repeatable system, not a one-off effect.",
  },
  {
    title: "Visual Effects & Post",
    desc: "Compositing and post work integrated into live footage so the effect never announces itself.",
  },
  {
    title: "Design",
    desc: "Swiss-style graphic design translated into motion: grid discipline, type hierarchy, negative space.",
  },
];

const processSteps = [
  { n: "01", title: "Discover", desc: "Brief, references, and the emotion every scene has to carry." },
  { n: "02", title: "Assemble", desc: "The first cut: structure, rhythm and the spine of the story." },
  { n: "03", title: "Refine", desc: "Sound-led passes, transitions, color, and effects integration." },
  { n: "04", title: "Deliver", desc: "Final export, versions, and platform-ready masters." },
];

function Home() {
  const [active, setActive] = useState<VideoProject | null>(null);
  const poster = posterFor(showreel);

  return (
    <div>
      <VideoLightbox project={active} onClose={() => setActive(null)} />

      {/* HERO */}
      <section className="relative overflow-hidden">
        {poster ? (
          <img
            src={poster}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-35"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/40" />
        <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-24 md:pb-28 md:pt-36">
          <span className="chip">Video Editor · Post-Production</span>
          <h1 className="mt-6 max-w-3xl font-serif text-5xl leading-[1.02] tracking-tight md:text-7xl">
            Every frame has a <span className="text-gradient-brand italic">purpose.</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Cinematic editing, motion graphics, visual effects and design — cut with rhythm,
            graded with restraint, and built on real work you can watch right here.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setActive(showreel)}
              className="btn-primary inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium"
            >
              <Play size={16} /> Watch the showreel
            </button>
            <Link
              to="/work"
              className="btn-ghost inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium"
            >
              View selected work <ArrowRight size={16} />
            </Link>
          </div>
          <dl className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-border pt-6">
            <div>
              <dt className="font-serif text-2xl md:text-3xl">{videoProjects.length}</dt>
              <dd className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                Pieces of work
              </dd>
            </div>
            <div>
              <dt className="font-serif text-2xl md:text-3xl">5</dt>
              <dd className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                Disciplines
              </dd>
            </div>
            <div>
              <dt className="font-serif text-2xl md:text-3xl">1</dt>
              <dd className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                Rule — purpose
              </dd>
            </div>
          </dl>
        </div>
      </section>

      {/* SELECTED WORK */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="chip">Selected Work</span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
              Cuts that carry the story
            </h2>
          </div>
          <Link
            to="/work"
            className="inline-flex items-center gap-1.5 text-sm text-[color:var(--brand)]"
          >
            All work <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {featuredProjects.slice(0, 6).map((p) => (
            <VideoCard key={p.title} project={p} onOpen={setActive} />
          ))}
        </div>
      </section>

      {/* SHOWREEL */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-8">
          <span className="chip">Showreel</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            The reel, start to finish
          </h2>
        </div>
        <VideoCard project={showreel} onOpen={setActive} size="large" />
      </section>

      {/* ABOUT / PHILOSOPHY */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="card-glow grid gap-10 rounded-2xl p-8 md:grid-cols-[1.2fr_1fr] md:p-12">
          <div>
            <span className="chip">About & Philosophy</span>
            <h2 className="mt-4 font-serif text-3xl leading-tight tracking-tight md:text-4xl">
              Editing is decision-making. Every cut earns its place.
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
              I edit for presence: long-held framing instead of frantic cuts, sound that leads
              the picture, effects that never announce themselves. Rhythm, restraint and
              resolve — whether it's a cinematic dialogue piece, a motion design system, or a
              scene study from the daily series.
            </p>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Everything on this site is real work from my channel — no stock, no placeholders.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-4">
            <a
              href={YOUTUBE_CHANNEL_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost inline-flex items-center justify-between gap-2 rounded-lg px-5 py-4 text-sm font-medium"
            >
              <span className="inline-flex items-center gap-2">
                <Youtube size={18} /> Watch on YouTube
              </span>
              <ArrowUpRight size={16} className="text-muted-foreground" />
            </a>
            <Link
              to="/work"
              className="btn-ghost inline-flex items-center justify-between gap-2 rounded-lg px-5 py-4 text-sm font-medium"
            >
              <span>Browse all work</span>
              <ArrowUpRight size={16} className="text-muted-foreground" />
            </Link>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <span className="chip">Services</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            What I do, end to end
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => (
            <div key={s.title} className="card-glow rounded-xl p-6">
              <h3 className="font-serif text-xl leading-snug">{s.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PROCESS */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <span className="chip">Process</span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">
            From brief to final master
          </h2>
        </div>
        <div className="grid gap-px overflow-hidden rounded-2xl bg-border md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((s) => (
            <div key={s.n} className="bg-[var(--surface)] p-7">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm text-[color:var(--brand)]">{s.n}</span>
                <div className="h-px flex-1 bg-border" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="card-glow relative overflow-hidden rounded-3xl p-10 md:p-16">
          <div className="pointer-events-none absolute -inset-32 bg-gradient-to-tr from-[var(--brand)]/20 to-[var(--brand-violet)]/20 blur-3xl" />
          <div className="relative">
            <h2 className="max-w-2xl font-serif text-3xl leading-tight tracking-tight md:text-5xl">
              Have footage that deserves a better edit?
            </h2>
            <p className="mt-4 max-w-xl text-muted-foreground">
              Tell me about the project — the material, the deadline, and the feeling it should
              leave behind. I'll take it from there.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="btn-primary inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium"
              >
                Start a project <ArrowRight size={16} />
              </Link>
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-ghost inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium"
              >
                <Youtube size={16} /> See the channel
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
