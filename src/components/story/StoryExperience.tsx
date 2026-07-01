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

// tiny base64 ambient loop (soft pad) — royalty free synthesized silence-safe fallback
const AMBIENT_URL =
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_1b1faa8b5b.mp3?filename=ambient-piano-amp-strings-10711.mp3";
const CLICK_URL =
  "https://cdn.pixabay.com/download/audio/2022/03/10/audio_c8e5a2d1b1.mp3?filename=click-124467.mp3";

export default function StoryExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [muted, setMuted] = useState(true);
  const ambientRef = useRef<Howl | null>(null);
  const whooshRef = useRef<Howl | null>(null);
  const activeSection = useRef(0);

  // Audio setup
  useEffect(() => {
    ambientRef.current = new Howl({
      src: [AMBIENT_URL],
      loop: true,
      volume: 0,
      html5: true,
    });
    whooshRef.current = new Howl({
      src: [CLICK_URL],
      volume: 0.25,
      html5: true,
    });
    ambientRef.current.play();
    return () => {
      ambientRef.current?.unload();
      whooshRef.current?.unload();
    };
  }, []);

  useEffect(() => {
    const target = muted ? 0 : 0.35;
    ambientRef.current?.fade(ambientRef.current.volume(), target, 800);
  }, [muted]);

  // Three.js scene
  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;
    const canvas = canvasRef.current;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.045);

    const camera = new THREE.PerspectiveCamera(
      55,
      window.innerWidth / window.innerHeight,
      0.1,
      100
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

    // Lights
    const ambient = new THREE.AmbientLight(0x334466, 0.6);
    scene.add(ambient);
    const key = new THREE.PointLight(0x6aa8ff, 30, 40);
    key.position.set(4, 3, 5);
    scene.add(key);
    const rim = new THREE.PointLight(0xb47bff, 25, 40);
    rim.position.set(-5, -2, 3);
    scene.add(rim);

    // Starfield
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
        size: 0.03,
        transparent: true,
        opacity: 0.7,
      })
    );
    scene.add(stars);

    // Section objects: 5 distinct 3D artifacts
    const group = new THREE.Group();
    scene.add(group);

    // 0: Torus knot (hero / brand core)
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.1, 0.32, 220, 32),
      new THREE.MeshStandardMaterial({
        color: 0x6aa8ff,
        metalness: 0.9,
        roughness: 0.18,
        emissive: 0x0a1a3a,
      })
    );
    knot.position.set(0, 0, 0);
    group.add(knot);

    // 1: Icosahedron cluster (retrieval nodes)
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
        })
      );
      const a = (i / 14) * Math.PI * 2;
      m.position.set(Math.cos(a) * 2.2, Math.sin(a * 1.3) * 1.2, Math.sin(a) * 2.2);
      retrieval.add(m);
    }
    retrieval.position.set(15, 0, 0);
    group.add(retrieval);

    // 2: Wireframe octahedron (reasoning graph)
    const reason = new THREE.Group();
    const outer = new THREE.Mesh(
      new THREE.OctahedronGeometry(1.6, 0),
      new THREE.MeshBasicMaterial({ color: 0xb47bff, wireframe: true })
    );
    const inner = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.9, 0),
      new THREE.MeshStandardMaterial({
        color: 0xb47bff,
        emissive: 0x2a1150,
        metalness: 0.6,
        roughness: 0.3,
      })
    );
    reason.add(outer, inner);
    reason.position.set(30, 0, 0);
    group.add(reason);

    // 3: Ring of agents
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
        })
      );
      m.position.set(Math.cos(a) * 1.8, 0, Math.sin(a) * 1.8);
      agents.add(m);
    }
    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(1.8, 0.03, 16, 128),
      new THREE.MeshBasicMaterial({ color: 0x6aa8ff, transparent: true, opacity: 0.6 })
    );
    torus.rotation.x = Math.PI / 2;
    agents.add(torus);
    agents.position.set(45, 0, 0);
    group.add(agents);

    // 4: Glowing crystal (delivery)
    const crystal = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.3, 0),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.85,
        thickness: 1.2,
        emissive: 0x1a2a55,
      })
    );
    crystal.position.set(60, 0, 0);
    group.add(crystal);

    const sectionAnchors = [0, 15, 30, 45, 60];

    // Scroll-driven camera
    const total = SECTIONS.length;
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: () => `+=${window.innerHeight * total}`,
      scrub: 1,
      pin: false,
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
          whooshRef.current?.play();
        }
      },
    });

    // Animate
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
    };
  }, []);

  return (
    <div ref={containerRef} className="relative bg-[#05070d] text-white">
      {/* Fixed 3D canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 h-screen w-screen"
        style={{ zIndex: 0 }}
      />

      {/* Vignette overlay */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          zIndex: 1,
          background:
            "radial-gradient(ellipse at center, transparent 45%, rgba(5,7,13,0.85) 100%)",
        }}
      />

      {/* Audio toggle */}
      <button
        onClick={() => setMuted((m) => !m)}
        className="fixed right-6 top-6 z-50 flex items-center gap-2 rounded-full border border-white/15 bg-black/40 px-4 py-2 text-xs tracking-[0.2em] uppercase backdrop-blur-md transition hover:border-white/40"
        aria-label={muted ? "Enable music" : "Mute music"}
      >
        {muted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
        {muted ? "Sound off" : "Sound on"}
      </button>

      {/* Sections */}
      <div className="relative" style={{ zIndex: 2 }}>
        {SECTIONS.map((s, i) => (
          <StorySection key={i} data={s} index={i} align={i % 2 === 0 ? "left" : "right"} />
        ))}

        {/* Outro */}
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
      }
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
      <div
        className={`max-w-xl ${align === "right" ? "ml-auto text-right" : ""}`}
      >
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
