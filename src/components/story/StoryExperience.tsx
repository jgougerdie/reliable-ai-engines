import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Howl } from "howler";
import { Volume2, VolumeX } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const SECTIONS = [
  {
    kicker: "Architect.systems",
    title: "Systems that survive production.",
    body: "A studio for LLM, RAG, and agent architectures — engineered for reliability, observability, and scale.",
  },
  {
    kicker: "01 — Retrieval",
    title: "Grounded knowledge, not hallucinations.",
    body: "Hybrid retrieval, semantic re-ranking, and IAM-aware filtering built on a deterministic backbone.",
  },
  {
    kicker: "02 — Reasoning",
    title: "Deterministic graphs over autonomous loops.",
    body: "LangGraph orchestration with validation nodes, retries, and typed contracts between every step.",
  },
  {
    kicker: "03 — Agents",
    title: "Multi-agent systems with guardrails.",
    body: "Router, tool-user, and validator agents coordinated with tracing, budgets, and human-in-the-loop.",
  },
  {
    kicker: "04 — Delivery",
    title: "Shipped to AWS. Monitored. Owned.",
    body: "ECS/Fargate, vector infra, evals, and observability — from architecture diagram to production runbook.",
  },
];

const AMBIENT_URL =
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b1faa8b5b.mp3?filename=ambient-piano-amp-strings-10711.mp3";
const CLICK_URL =
  "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8e5a2d1b1.mp3?filename=click-124467.mp3";

// Tiny SVG data-URI textures — reliable, no network dependency, but exercise
// the real texture upload / shader compile path so progress is meaningful.
const TEXTURE_URLS = [
  // soft radial glow (used for particle sprite)
  "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='128' height='128'>
        <defs><radialGradient id='g' cx='50%' cy='50%' r='50%'>
          <stop offset='0%' stop-color='white' stop-opacity='1'/>
          <stop offset='60%' stop-color='#9fb8ff' stop-opacity='0.4'/>
          <stop offset='100%' stop-color='#05070d' stop-opacity='0'/>
        </radialGradient></defs>
        <rect width='128' height='128' fill='url(#g)'/>
      </svg>`,
    ),
  // subtle noise / environment gradient
  "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='256' height='256'>
        <defs><linearGradient id='l' x1='0' y1='0' x2='1' y2='1'>
          <stop offset='0%' stop-color='#0a1a3a'/>
          <stop offset='50%' stop-color='#1a1030'/>
          <stop offset='100%' stop-color='#05070d'/>
        </linearGradient></defs>
        <rect width='256' height='256' fill='url(#l)'/>
      </svg>`,
    ),
];

type Assets = {
  ambient: Howl;
  whoosh: Howl;
  particle: THREE.Texture;
  envGradient: THREE.Texture;
};

export default function StoryExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [phase, setPhase] = useState("Warming up");
  const assetsRef = useRef<Assets | null>(null);
  const activeSection = useRef(0);

  // ---- Preload flow ------------------------------------------------------
  useEffect(() => {
    let cancelled = false;

    // 4 tracked assets: 2 audio + 2 textures. Each contributes 25%.
    const weights = { ambient: 0, whoosh: 0, particle: 0, envGradient: 0 };
    const update = (key: keyof typeof weights, v: number, label?: string) => {
      weights[key] = v;
      const total =
        (weights.ambient + weights.whoosh + weights.particle + weights.envGradient) / 4;
      if (!cancelled) {
        setProgress(total);
        if (label) setPhase(label);
      }
    };

    // --- Textures via LoadingManager ---
    const manager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(manager);
    setPhase("Streaming textures");

    const particle = loader.load(TEXTURE_URLS[0], () =>
      update("particle", 1, "Streaming textures"),
    );
    const envGradient = loader.load(TEXTURE_URLS[1], () =>
      update("envGradient", 1, "Streaming textures"),
    );

    // --- Audio via Howler ---
    const ambient = new Howl({
      src: [AMBIENT_URL],
      loop: true,
      volume: 0,
      html5: true,
      onload: () => update("ambient", 1, "Loading audio"),
      onloaderror: () => update("ambient", 1, "Audio unavailable"),
    });
    const whoosh = new Howl({
      src: [CLICK_URL],
      volume: 0.25,
      html5: true,
      onload: () => update("whoosh", 1, "Loading audio"),
      onloaderror: () => update("whoosh", 1, "Audio unavailable"),
    });

    // safety timeout — never block the scene more than 6s waiting on audio
    const timeout = window.setTimeout(() => {
      if (weights.ambient < 1) update("ambient", 1, "Audio skipped");
      if (weights.whoosh < 1) update("whoosh", 1, "Audio skipped");
    }, 6000);

    // When everything is done, expose assets and flip ready.
    const check = window.setInterval(() => {
      if (
        weights.ambient >= 1 &&
        weights.whoosh >= 1 &&
        weights.particle >= 1 &&
        weights.envGradient >= 1
      ) {
        window.clearInterval(check);
        assetsRef.current = { ambient, whoosh, particle, envGradient };
        setPhase("Initializing scene");
        // small delay so the 100% bar is visible for a beat
        window.setTimeout(() => !cancelled && setReady(true), 250);
      }
    }, 80);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
      window.clearInterval(check);
      // If unmounted before ready, dispose here. Otherwise scene effect owns them.
      if (!assetsRef.current) {
        ambient.unload();
        whoosh.unload();
        particle.dispose();
        envGradient.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const assets = assetsRef.current;
    if (!assets) return;
    const target = muted ? 0 : 0.35;
    assets.ambient.fade(assets.ambient.volume(), target, 800);
  }, [muted, ready]);

  // ---- Scene (only after preload) ---------------------------------------
  useEffect(() => {
    if (!ready) return;
    if (!canvasRef.current || !containerRef.current) return;
    const assets = assetsRef.current!;
    const canvas = canvasRef.current;

    // start ambient (muted) so toggle can fade in
    assets.ambient.play();

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.045);
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0, 8);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x05070d, 1);

    const ambient = new THREE.AmbientLight(0x334466, 0.6);
    scene.add(ambient);
    const key = new THREE.PointLight(0x6aa8ff, 30, 40);
    key.position.set(4, 3, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0xb47bff, 25, 40);
    rim.position.set(-5, -2, 3);
    scene.add(rim);

    // Starfield with the preloaded particle sprite
    const starGeo = new THREE.BufferGeometry();
    const starCount = 1800;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 60;
      starPos[i * 3 + 1] = (Math.random() - 0.5) * 60;
      starPos[i * 3 + 2] = (Math.random() - 0.5) * 60;
    }
    starGeo.setAttribute("position", new THREE.BufferAttribute(starPos, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({
        color: 0x9fb8ff,
        size: 0.15,
        map: assets.particle,
        transparent: true,
        depthWrite: false,
        opacity: 0.85,
      }),
    );
    scene.add(stars);

    const group = new THREE.Group();
    scene.add(group);

    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.1, 0.32, 220, 32),
      new THREE.MeshStandardMaterial({
        color: 0x6aa8ff,
        metalness: 0.9,
        roughness: 0.18,
        emissive: 0x0a1a3a,
        emissiveMap: assets.envGradient,
      }),
    );
    group.add(knot);

    const retrieval = new THREE.Group();
    for (let i = 0; i < 14; i++) {
      const m = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.25 + Math.random() * 0.25, 0),
        new THREE.MeshStandardMaterial({
          color: 0x7cf0ff,
          metalness: 0.7,
          roughness: 0.25,
          emissive: 0x0a2a3a,
          flatShading: true,
        }),
      );
      const a = (i / 14) * Math.PI * 2;
      m.position.set(Math.cos(a) * 2.2, Math.sin(a * 1.3) * 1.2, Math.sin(a) * 2.2);
      retrieval.add(m);
    }
    retrieval.position.set(15, 0, 0);
    group.add(retrieval);

    const reason = new THREE.Group();
    const outer = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.6, 0),
      new THREE.MeshBasicMaterial({ color: 0xb47bff, wireframe: true }),
    );
    const inner = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.9, 0),
      new THREE.MeshStandardMaterial({
        color: 0xb47bff,
        emissive: 0x2a1150,
        metalness: 0.6,
        roughness: 0.3,
      }),
    );
    reason.add(outer, inner);
    reason.position.set(30, 0, 0);
    group.add(reason);

    const agents = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      const m = new THREE.Mesh(
        new THREE.SphereGeometry(0.4, 32, 32),
        new THREE.MeshStandardMaterial({
          color: i === 0 ? 0xffcf6a : 0x6aa8ff,
          emissive: i === 0 ? 0x3a2400 : 0x0a1a3a,
          metalness: 0.8,
          roughness: 0.2,
        }),
      );
      m.position.set(Math.cos(a) * 1.8, 0, Math.sin(a) * 1.8);
      agents.add(m);
    }
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.03, 16, 128),
      new THREE.MeshBasicMaterial({ color: 0x6aa8ff, transparent: true, opacity: 0.6 }),
    );
    torus.rotation.x = Math.PI / 2;
    agents.add(torus);
    agents.position.set(45, 0, 0);
    group.add(agents);

    const crystal = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.3, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.85,
        thickness: 1.2,
        emissive: 0x1a2a55,
      }),
    );
    crystal.position.set(60, 0, 0);
    group.add(crystal);

    // Warm shader compilation before first frame so the initial paint is smooth.
    renderer.compile(scene, camera);

    const sectionAnchors = [0, 15, 30, 45, 60];
    const total = SECTIONS.length;
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: () => `+=${window.innerHeight * total}`,
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress * (total - 1);
        const idx = Math.floor(p);
        const frac = p - idx;
        const x0 = sectionAnchors[idx] ?? 0;
        const x1 = sectionAnchors[Math.min(idx + 1, total - 1)] ?? x0;
        camera.position.x = x0 + (x1 - x0) * frac;
        camera.position.y = Math.sin(p * 0.6) * 0.4;
        camera.position.z = 8 - Math.sin(frac * Math.PI) * 2.2;
        camera.lookAt(camera.position.x, 0, 0);

        const newSection = Math.round(p);
        if (newSection !== activeSection.current) {
          activeSection.current = newSection;
          assets.whoosh.play();
        }
      },
    });

    const clock = new THREE.Clock();
    let raf = 0;
    const tick = () => {
      const t = clock.getElapsedTime();
      knot.rotation.x = t * 0.25;
      knot.rotation.y = t * 0.35;
      retrieval.rotation.y = t * 0.4;
      retrieval.children.forEach((c, i) => {
        c.position.y = Math.sin(t * 1.2 + i) * 1.2;
      });
      reason.rotation.y = t * 0.5;
      reason.rotation.x = t * 0.2;
      outer.rotation.y = -t * 0.7;
      agents.rotation.y = t * 0.6;
      crystal.rotation.y = t * 0.3;
      crystal.rotation.x = t * 0.15;
      stars.rotation.y = t * 0.01;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      st.kill();
      renderer.dispose();
      assets.ambient.unload();
      assets.whoosh.unload();
      assets.particle.dispose();
      assets.envGradient.dispose();
    };
  }, [ready]);

  const pct = Math.round(progress * 100);

  return (
    <div ref={containerRef} className="relative bg-[#05070d] text-white">
      {/* Preloader overlay */}
      <div
        className={`fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[#05070d] transition-opacity duration-700 ${
          ready && pct >= 100 ? "pointer-events-none opacity-0" : "opacity-100"
        }`}
        aria-hidden={ready}
      >
        <p className="font-serif text-xs uppercase tracking-[0.4em] text-white/50">
          Architect.systems
        </p>
        <p className="mt-4 font-serif text-2xl italic text-white/90 md:text-3xl">
          {phase}…
        </p>
        <div className="mt-8 h-[2px] w-64 overflow-hidden rounded-full bg-white/10 md:w-80">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#6aa8ff] to-[#b47bff] transition-[width] duration-200 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-4 font-mono text-xs tracking-[0.3em] text-white/50">
          {pct.toString().padStart(3, "0")}%
        </p>
      </div>

      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-screen w-screen"
        style={{ zIndex: 0 }}
      />

      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(5,7,13,0.85) 100%)",
        }}
      />

      <button
        onClick={() => setMuted((m) => !m)}
        disabled={!ready}
        className="fixed right-6 top-6 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs tracking-[0.2em] uppercase backdrop-blur-md transition hover:border-white/40 disabled:opacity-40"
        aria-label={muted ? "Enable music" : "Mute music"}
      >
        {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        {muted ? "Sound off" : "Sound on"}
      </button>

      <div className="relative" style={{ zIndex: 2 }}>
        {SECTIONS.map((s, i) => (
          <StorySection key={i} data={s} index={i} align={i % 2 === 0 ? "left" : "right"} />
        ))}

        <section className="relative flex min-h-[60vh] items-center justify-center px-6 py-24">
          <div className="text-center">
            <p className="font-serif text-xs uppercase tracking-[0.4em] text-white/50">
              Ready when you are
            </p>
            <h2 className="mt-6 font-serif text-5xl italic md:text-7xl">
              Let's architect it.
            </h2>
            <a
              href="/contact"
              className="mt-10 inline-block rounded-full border border-white/30 px-8 py-3 text-sm tracking-[0.25em] uppercase transition hover:border-white hover:bg-white hover:text-black"
            >
              Start a conversation
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

function StorySection({
  data,
  index,
  align,
}: {
  data: (typeof SECTIONS)[number];
  index: number;
  align: "left" | "right";
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const anim = gsap.fromTo(
      el.querySelectorAll("[data-reveal]"),
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1.1,
        stagger: 0.12,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 75%",
          end: "top 30%",
          toggleActions: "play reverse play reverse",
        },
      },
    );
    return () => {
      anim.scrollTrigger?.kill();
      anim.kill();
    };
  }, []);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[90vh] items-center px-6 md:px-16"
      style={{ marginBottom: index === SECTIONS.length - 1 ? 0 : "2vh" }}
    >
      <div className={`max-w-xl ${align === "right" ? "ml-auto text-right" : ""}`}>
        <p
          data-reveal
          className="font-serif text-xs uppercase tracking-[0.4em] text-white/60"
        >
          {data.kicker}
        </p>
        <h2
          data-reveal
          className="mt-6 font-serif text-4xl leading-[1.05] md:text-6xl"
          style={{ fontWeight: 400 }}
        >
          {data.title}
        </h2>
        <p
          data-reveal
          className="mt-6 font-serif text-lg italic text-white/75 md:text-xl"
        >
          {data.body}
        </p>
      </div>
    </section>
  );
}
