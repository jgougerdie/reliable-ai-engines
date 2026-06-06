import { useEffect, useState } from "react";

/**
 * Animated multi-agent orchestration graph.
 * Visualizes a live system: a Router dispatches tasks to specialist agents
 * (Retriever, Reasoner, Validator), which return results to an Aggregator.
 * Messages travel along the edges; nodes pulse when active.
 */

type NodeId = "router" | "retriever" | "reasoner" | "validator" | "aggregator";

const NODES: Record<NodeId, { x: number; y: number; label: string; sub: string }> = {
  router:     { x: 90,  y: 200, label: "Router",     sub: "dispatch" },
  retriever:  { x: 290, y: 80,  label: "Retriever",  sub: "RAG · vector" },
  reasoner:   { x: 290, y: 200, label: "Reasoner",   sub: "LLM · plan" },
  validator:  { x: 290, y: 320, label: "Validator",  sub: "schema · eval" },
  aggregator: { x: 510, y: 200, label: "Aggregator", sub: "merge · ship" },
};

const EDGES: Array<{ id: string; from: NodeId; to: NodeId; d: string }> = [
  { id: "r-ret", from: "router",    to: "retriever",  d: "M 130 200 C 200 200, 220 80, 250 80" },
  { id: "r-rea", from: "router",    to: "reasoner",   d: "M 130 200 L 250 200" },
  { id: "r-val", from: "router",    to: "validator",  d: "M 130 200 C 200 200, 220 320, 250 320" },
  { id: "ret-a", from: "retriever", to: "aggregator", d: "M 330 80 C 380 80, 440 200, 470 200" },
  { id: "rea-a", from: "reasoner",  to: "aggregator", d: "M 330 200 L 470 200" },
  { id: "val-a", from: "validator", to: "aggregator", d: "M 330 320 C 380 320, 440 200, 470 200" },
];

const ACTIVITY: Array<{ status: string; active: NodeId; edge: string }> = [
  { status: "router · dispatching",  active: "router",     edge: "r-ret" },
  { status: "retriever · k=8",       active: "retriever",  edge: "ret-a" },
  { status: "reasoner · plan step",  active: "reasoner",   edge: "rea-a" },
  { status: "validator · schema ok", active: "validator",  edge: "val-a" },
  { status: "aggregator · merged",   active: "aggregator", edge: "r-rea" },
  { status: "router · next task",    active: "router",     edge: "r-val" },
];

export function AgentGraph() {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setStep((s) => (s + 1) % ACTIVITY.length), 1600);
    return () => clearInterval(t);
  }, [paused]);

  const current = ACTIVITY[step];

  return (
    <div
      className="relative card-glow rounded-2xl overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="img"
      aria-label="Live multi-agent orchestration graph"
    >
      <svg
        viewBox="0 0 600 400"
        className="w-full h-auto block"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="agentBg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.22 0.03 270)" />
            <stop offset="100%" stopColor="oklch(0.17 0.025 270)" />
          </linearGradient>
          <linearGradient id="edgeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"  stopColor="var(--brand)"        stopOpacity="0.15" />
            <stop offset="100%" stopColor="var(--brand-violet)" stopOpacity="0.15" />
          </linearGradient>
          <radialGradient id="nodeGlow">
            <stop offset="0%"   stopColor="var(--brand)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--brand)" stopOpacity="0" />
          </radialGradient>
          <pattern id="dots" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="oklch(1 0 0 / 0.05)" />
          </pattern>
        </defs>

        <rect width="600" height="400" fill="url(#agentBg)" />
        <rect width="600" height="400" fill="url(#dots)" />

        {/* edges */}
        {EDGES.map((e) => (
          <g key={e.id}>
            <path d={e.d} stroke="url(#edgeGrad)" strokeWidth="2" fill="none" />
            <path
              d={e.d}
              stroke="var(--brand)"
              strokeWidth={current.edge === e.id ? 2 : 1}
              strokeOpacity={current.edge === e.id ? 0.9 : 0.25}
              fill="none"
              style={{ transition: "stroke-opacity .4s ease, stroke-width .4s ease" }}
            />
            {/* packet traveling along the active edge */}
            {current.edge === e.id && (
              <circle r="4" fill="var(--brand)">
                <animateMotion dur="1.4s" repeatCount="indefinite" path={e.d} />
                <animate attributeName="opacity" values="0;1;1;0" dur="1.4s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        ))}

        {/* nodes */}
        {(Object.entries(NODES) as Array<[NodeId, typeof NODES[NodeId]]>).map(([id, n]) => {
          const active = current.active === id;
          return (
            <g key={id} transform={`translate(${n.x} ${n.y})`}>
              {active && <circle r="38" fill="url(#nodeGlow)" />}
              <circle
                r="28"
                fill="oklch(0.22 0.03 270)"
                stroke={active ? "var(--brand)" : "oklch(1 0 0 / 0.18)"}
                strokeWidth={active ? 2 : 1}
                style={{ transition: "stroke .3s ease" }}
              />
              {active && (
                <circle r="28" fill="none" stroke="var(--brand)" strokeOpacity="0.6">
                  <animate attributeName="r" values="28;42" dur="1.4s" repeatCount="indefinite" />
                  <animate attributeName="stroke-opacity" values="0.6;0" dur="1.4s" repeatCount="indefinite" />
                </circle>
              )}
              <text
                textAnchor="middle"
                y="4"
                fontSize="12"
                fontFamily="JetBrains Mono, monospace"
                fill="oklch(0.96 0.005 250)"
              >
                {n.label}
              </text>
              <text
                textAnchor="middle"
                y="50"
                fontSize="10"
                fontFamily="JetBrains Mono, monospace"
                fill="oklch(0.68 0.02 260)"
              >
                {n.sub}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />

      <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between font-mono text-[11px] text-muted-foreground">
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          className="chip animate-pulse-soft cursor-pointer hover:text-foreground transition"
          aria-label={paused ? "Resume orchestration" : "Pause orchestration"}
        >
          <span
            className="inline-block h-2 w-2 rounded-full"
            style={{ background: paused ? "oklch(0.7 0.15 60)" : "oklch(0.7 0.2 145)" }}
          />
          {paused ? "paused" : "live"} · {current.status}
        </button>
        <span>orchestration.graph</span>
      </div>
    </div>
  );
}
