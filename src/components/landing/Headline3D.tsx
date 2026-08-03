import { useEffect, useRef, useState } from "react";

/** Headline with pointer-driven 3D tilt, layered depth and a gentle float. */
export function Headline3D() {
  const ref = useRef<HTMLHeadingElement>(null);
  const [t, setT] = useState({ rx: 0, ry: 0 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = (e.clientX - (r.left + r.width / 2)) / (r.width / 2);
      const cy = (e.clientY - (r.top + r.height / 2)) / (r.height / 2);
      setT({ rx: Math.max(-1, Math.min(1, cy)) * -8, ry: Math.max(-1, Math.min(1, cx)) * 8 });
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div className="mt-6 animate-float [perspective:1000px]">
      <h1
        ref={ref}
        className="relative font-serif text-5xl leading-[1.02] tracking-tight transition-transform duration-300 ease-out will-change-transform sm:text-6xl lg:text-7xl"
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
        <span
          className="animate-text-shimmer relative block"
          style={{ transform: "translateZ(32px)" }}
        >
          Production AI,{" "}
          <span
            className="italic"
            style={{ transform: "translateZ(25px)", display: "inline-block" }}
          >
            answered live.
          </span>
        </span>
      </h1>
    </div>
  );
}
