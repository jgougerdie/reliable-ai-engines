import { useEffect, useState } from "react";

/**
 * Interactive cover visualization for the article
 * "Why LLM-Only Document Extraction Fails — And the Deterministic-First Fix".
 *
 * Shows two pipelines side by side, animated:
 *   1. LLM-only        : doc → LLM → 🎲 noisy / hallucinated output
 *   2. Deterministic-first : doc → parse → classify → validate → ✓ structured output
 *
 * The user can toggle "Run pipeline" to replay the animation, or click either
 * track to focus it.
 */

type Track = "llm" | "det";

const STAGES: Record<Track, { label: string; sub: string }[]> = {
  llm: [
    { label: "PDF → text", sub: "lossy flatten" },
    { label: "LLM", sub: "guess structure" },
    { label: "Output", sub: "hallucinated" },
  ],
  det: [
    { label: "Geometric parse", sub: "shapes + coords" },
    { label: "Classify", sub: "symbols + relations" },
    { label: "LLM reasoning", sub: "scoped + grounded" },
    { label: "Validate", sub: "schema + rules" },
    { label: "Structured output", sub: "reproducible" },
  ],
};

export function DeterministicPipeline() {
  const [tick, setTick] = useState(0);
  const [running, setRunning] = useState(true);
  const [focus, setFocus] = useState<Track | null>(null);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 1000), 1400);
    return () => clearInterval(id);
  }, [running]);

  return (
    <div className="mb-10 rounded-xl border border-border bg-[var(--surface)] p-5 md:p-7">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[color:var(--brand)] animate-pulse-soft" />
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground">
            live · pipeline comparison
          </span>
        </div>
        <button
          onClick={() => setRunning((r) => !r)}
          className="text-[11px] font-mono uppercase tracking-wider chip"
        >
          {running ? "pause" : "run"}
        </button>
      </div>

      <Track
        name="LLM-only"
        track="llm"
        tone="warn"
        tick={tick}
        focused={focus}
        onFocus={setFocus}
      />
      <div className="my-4 h-px bg-border" />
      <Track
        name="Deterministic-first"
        track="det"
        tone="ok"
        tick={tick}
        focused={focus}
        onFocus={setFocus}
      />

      <p className="mt-5 text-[12px] font-mono text-muted-foreground text-center">
        Same document, two architectures. Only one is reproducible.
      </p>
    </div>
  );
}

function Track({
  name,
  track,
  tone,
  tick,
  focused,
  onFocus,
}: {
  name: string;
  track: Track;
  tone: "warn" | "ok";
  tick: number;
  focused: Track | null;
  onFocus: (t: Track | null) => void;
}) {
  const stages = STAGES[track];
  const active = tick % (stages.length + 1);
  const done = active === stages.length;
  const dim = focused && focused !== track;

  const accent =
    tone === "ok"
      ? "color-mix(in oklab, var(--brand) 70%, white)"
      : "rgb(251 191 36)"; // amber-400

  return (
    <button
      type="button"
      onClick={() => onFocus(focused === track ? null : track)}
      className={`w-full text-left transition-opacity ${dim ? "opacity-40" : "opacity-100"}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span
          className="text-[11px] font-mono"
          style={{ color: accent }}
        >
          {tone === "ok"
            ? done
              ? "✓ structured"
              : `step ${active + 1}/${stages.length}`
            : done
              ? "⚠ unreliable"
              : `step ${active + 1}/${stages.length}`}
        </span>
      </div>

      <div className="flex items-stretch gap-2 overflow-x-auto">
        {stages.map((s, i) => {
          const isActive = i === active;
          const isPast = i < active || done;
          return (
            <div key={i} className="flex items-center gap-2 shrink-0">
              <div
                className="rounded-lg border px-3 py-2 min-w-[110px] transition-all"
                style={{
                  borderColor: isActive
                    ? accent
                    : isPast
                      ? `color-mix(in oklab, ${accent} 40%, var(--border))`
                      : "var(--border)",
                  background: isActive
                    ? `color-mix(in oklab, ${accent} 12%, transparent)`
                    : "transparent",
                  boxShadow: isActive
                    ? `0 0 0 3px color-mix(in oklab, ${accent} 18%, transparent)`
                    : "none",
                }}
              >
                <div className="text-[12px] font-medium text-foreground leading-tight">
                  {s.label}
                </div>
                <div className="text-[10px] font-mono text-muted-foreground mt-0.5">
                  {s.sub}
                </div>
              </div>
              {i < stages.length - 1 && (
                <Arrow active={isPast || isActive} color={accent} />
              )}
            </div>
          );
        })}
      </div>
    </button>
  );
}

function Arrow({ active, color }: { active: boolean; color: string }) {
  return (
    <svg width="22" height="10" viewBox="0 0 22 10" aria-hidden>
      <line
        x1="0"
        y1="5"
        x2="18"
        y2="5"
        stroke={active ? color : "var(--border)"}
        strokeWidth="1.5"
        strokeDasharray="3 3"
      >
        {active && (
          <animate
            attributeName="stroke-dashoffset"
            from="6"
            to="0"
            dur="0.6s"
            repeatCount="indefinite"
          />
        )}
      </line>
      <path
        d="M16 1 L21 5 L16 9"
        fill="none"
        stroke={active ? color : "var(--border)"}
        strokeWidth="1.5"
      />
    </svg>
  );
}
