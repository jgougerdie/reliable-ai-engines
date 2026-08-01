import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Ambient 3D backdrop for the landing page.
 * Floating wireframe artifacts + starfield with mouse parallax.
 */
export default function LandingScene3D() {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05070d, 0.055);

    const camera = new THREE.PerspectiveCamera(48, host.clientWidth / host.clientHeight, 0.1, 100);
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(host.clientWidth, host.clientHeight);
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const BRAND = 0x6aa8ff;
    const VIOLET = 0xb47bff;

    // Lights
    scene.add(new THREE.AmbientLight(0x93b4ff, 0.5));
    const key = new THREE.PointLight(BRAND, 60, 60);
    key.position.set(6, 5, 8);
    scene.add(key);
    const rim = new THREE.PointLight(VIOLET, 45, 60);
    rim.position.set(-7, -4, 4);
    scene.add(rim);

    const group = new THREE.Group();
    scene.add(group);

    // Central knot — the "system"
    const knot = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.1, 0.42, 220, 32, 2, 3),
      new THREE.MeshStandardMaterial({
        color: 0x0d1526,
        emissive: BRAND,
        emissiveIntensity: 0.22,
        metalness: 0.9,
        roughness: 0.22,
        wireframe: false,
      }),
    );
    knot.position.set(0.6, 0.2, 0);
    group.add(knot);

    const knotWire = new THREE.Mesh(
      new THREE.TorusKnotGeometry(2.35, 0.02, 160, 16, 2, 3),
      new THREE.MeshBasicMaterial({ color: VIOLET, transparent: true, opacity: 0.35 }),
    );
    knotWire.position.copy(knot.position);
    group.add(knotWire);

    // Orbiting nodes — agents
    const nodes: THREE.Mesh[] = [];
    const nodeGeo = new THREE.IcosahedronGeometry(0.22, 0);
    for (let i = 0; i < 7; i++) {
      const m = new THREE.Mesh(
        nodeGeo,
        new THREE.MeshStandardMaterial({
          color: i % 2 ? VIOLET : BRAND,
          emissive: i % 2 ? VIOLET : BRAND,
          emissiveIntensity: 0.7,
          roughness: 0.3,
          metalness: 0.6,
        }),
      );
      group.add(m);
      nodes.push(m);
    }

    // Orbit rings
    for (let i = 0; i < 3; i++) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(3.4 + i * 0.9, 3.41 + i * 0.9, 128),
        new THREE.MeshBasicMaterial({
          color: i % 2 ? VIOLET : BRAND,
          transparent: true,
          opacity: 0.14,
          side: THREE.DoubleSide,
        }),
      );
      ring.rotation.x = Math.PI / 2.4 + i * 0.12;
      ring.rotation.y = i * 0.2;
      ring.position.copy(knot.position);
      group.add(ring);
    }

    // Starfield
    const starCount = 900;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
      positions[i * 3 + 2] = -Math.random() * 40;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const stars = new THREE.Points(
      starGeo,
      new THREE.PointsMaterial({ color: 0x9fc0ff, size: 0.06, transparent: true, opacity: 0.7 }),
    );
    scene.add(stars);

    // Mouse parallax
    const target = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      target.x = (e.clientX / window.innerWidth - 0.5) * 2;
      target.y = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer);

    const onResize = () => {
      if (!host.clientWidth) return;
      camera.aspect = host.clientWidth / host.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(host.clientWidth, host.clientHeight);
    };
    window.addEventListener("resize", onResize);

    let raf = 0;
    const clock = new THREE.Clock();
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();
      const speed = prefersReduced ? 0.15 : 1;

      knot.rotation.y = t * 0.16 * speed;
      knot.rotation.x = Math.sin(t * 0.2) * 0.22;
      knotWire.rotation.copy(knot.rotation);
      knotWire.rotation.y += 0.2;

      nodes.forEach((n, i) => {
        const a = t * (0.35 + i * 0.05) * speed + (i / nodes.length) * Math.PI * 2;
        const r = 3.6 + (i % 3) * 0.9;
        n.position.set(
          knot.position.x + Math.cos(a) * r,
          knot.position.y + Math.sin(a * 0.8) * 1.4,
          Math.sin(a) * r * 0.55,
        );
        n.rotation.x = n.rotation.y = t * 0.9;
      });

      stars.rotation.y = t * 0.01;

      camera.position.x += (target.x * 1.6 - camera.position.x) * 0.04;
      camera.position.y += (-target.y * 1.0 - camera.position.y) * 0.04;
      camera.lookAt(knot.position);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else mat?.dispose();
      });
      host.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={hostRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
