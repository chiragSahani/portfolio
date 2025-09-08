'use client';

import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@iconify/react';

/* ----------------------
   Constants
   ---------------------- */
const TECH_ICONS = [
  { id: 'react', label: 'React', color: '#61DAFB', position: [2, 1, 0] },
  { id: 'next', label: 'Next.js', color: '#FFFFFF', position: [-2, 0.6, 1] },
  { id: 'three', label: 'Three.js', color: '#049EF4', position: [1.5, -1, -1] },
  { id: 'ts', label: 'TypeScript', color: '#3178C6', position: [-1.5, 1.2, 0.5] },
  { id: 'node', label: 'Node.js', color: '#68A063', position: [0, -1.6, 1.5] },
] as const;

/* ----------------------
   Helpers
   ---------------------- */
// quick WebGL support check
function hasWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      canvas.getContext('webgl') ||
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      canvas.getContext('experimental-webgl')
    );
  } catch {
    return false;
  }
}

/* ----------------------
   FloatingTechIcons (lightweight)
   ---------------------- */
function FloatingTechIcons({
  onHover,
  onMove,
  onLeave,
  disabled = false,
}: {
  onHover: (label: string, x: number, y: number) => void;
  onMove: (x: number, y: number) => void;
  onLeave: () => void;
  disabled?: boolean;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const prefersReduced = useReducedMotion();

  useFrame((state) => {
    if (!groupRef.current || disabled) return;
    const t = state.clock.elapsedTime;
    // subtle rotation; slower if reduced motion
    groupRef.current.rotation.y = t * (prefersReduced ? 0.01 : 0.06);
    groupRef.current.rotation.x = Math.sin(t * 0.12) * (prefersReduced ? 0.005 : 0.02);

    // tiny bob (very cheap)
    groupRef.current.children.forEach((c, i) => {
      c.position.y += Math.sin(t * 0.5 + i) * 0.0006;
    });
  });

  return (
    <group ref={groupRef}>
      {TECH_ICONS.map((ic) => (
        <mesh
          key={ic.id}
          position={ic.position as [number, number, number]}
          onPointerOver={(e) => {
            if (disabled) return;
            e.stopPropagation();
            onHover(ic.label, e.clientX, e.clientY);
            const m = e.object as THREE.Mesh;
            m.scale.set(1.14, 1.14, 1.14);
            (m.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(ic.color);
          }}
          onPointerMove={(e) => {
            if (disabled) return;
            e.stopPropagation();
            onMove(e.clientX, e.clientY);
          }}
          onPointerOut={(e) => {
            if (disabled) return;
            e.stopPropagation();
            onLeave();
            const m = e.object as THREE.Mesh;
            m.scale.set(1, 1, 1);
            (m.material as THREE.MeshStandardMaterial).emissive = new THREE.Color('#000000');
          }}
          // small perf hints
          castShadow={false}
          receiveShadow={false}
        >
          <boxGeometry args={[0.56, 0.56, 0.12]} />
          <meshStandardMaterial
            color={ic.color}
            roughness={0.28}
            metalness={0.5}
            emissive="#000000"
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

/* ----------------------
   DecorativeSphere (low-poly)
   ---------------------- */
function DecorativeSphere({ visible = true }: { visible?: boolean }) {
  const ref = useRef<THREE.Mesh | null>(null);
  const prefersReduced = useReducedMotion();

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * (prefersReduced ? 0.01 : 0.03);
    ref.current.rotation.x = Math.sin(t * 0.02) * (prefersReduced ? 0.003 : 0.01);
  });

  if (!visible) return null;

  return (
    <mesh ref={ref} position={[0, -0.25, -2.5]}>
      {/* fewer segments for perf */}
      <sphereGeometry args={[1.6, 12, 12]} />
      <meshStandardMaterial color="#0ea5e9" transparent opacity={0.06} />
    </mesh>
  );
}

/* ----------------------
   CountUp Hook (smooth & cancel-safe)
   ---------------------- */
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
}

/* ----------------------
   AboutSection (improved)
   ---------------------- */
export default function AboutSection() {
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);
  const [darkCanvas, setDarkCanvas] = useState(true);
  const [webglOK, setWebglOK] = useState<boolean | null>(null);
  const prefersReduced = useReducedMotion();

  // counts
  const years = useCountUp(1, 900);
  const projects = useCountUp(50, 1400);
  const companies = useCountUp(2, 900);
  const techs = useCountUp(15, 1000);

  // debounced tooltip updates to avoid too many state changes
  const tooltipRef = useRef(tooltip);
  useEffect(() => {
    tooltipRef.current = tooltip;
  }, [tooltip]);

  // check WebGL support once on mount
  useEffect(() => {
    setWebglOK(hasWebGL());
  }, []);

  // handlers
  const onIconHover = useCallback((label: string, x: number, y: number) => {
    setTooltip({ label, x, y });
  }, []);

  const onIconMove = useCallback((x: number, y: number) => {
    // avoid setting state if location hasn't changed significantly
    setTooltip((t) => {
      if (!t) return t;
      const dx = Math.abs(t.x - x);
      const dy = Math.abs(t.y - y);
      if (dx + dy < 6) return t;
      return { ...t, x, y };
    });
  }, []);

  const onIconLeave = useCallback(() => setTooltip(null), []);

  const toggleCanvas = useCallback(() => setDarkCanvas((d) => !d), []);

  // memoized canvas contents toggle (disable complex interactions when reduced)
  const disableCanvas = prefersReduced || webglOK === false;

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-black">
      {/* Canvas + 3D (absolute) */}
      <div className="absolute inset-0 z-0">
        {webglOK === false ? (
          // fallback: subtle gradient if WebGL missing
          <div className="w-full h-full bg-gradient-to-b from-black via-zinc-900 to-black" />
        ) : (
          <Canvas
            camera={{ position: [0, 0, 6] }}
            dpr={[1, 1.5]}
            style={{ width: '100%', height: '100%' }}
          >
            {darkCanvas && <color attach="background" args={['#000000']} />}
            <ambientLight intensity={0.6} />
            <directionalLight position={[6, 6, 6]} intensity={0.7} />
            <pointLight position={[-6, -6, -6]} intensity={0.45} color="#3b82f6" />
            <pointLight position={[6, -6, 6]} intensity={0.35} color="#8b5cf6" />

            <Suspense fallback={null}>
              <FloatingTechIcons
                onHover={onIconHover}
                onMove={onIconMove}
                onLeave={onIconLeave}
                disabled={disableCanvas}
              />
              <DecorativeSphere visible={!disableCanvas} />
            </Suspense>
          </Canvas>
        )}
      </div>

      {/* Tooltip (HTML overlay) */}
      <div
        aria-hidden={tooltip ? 'false' : 'true'}
        role="tooltip"
        className="pointer-events-none absolute z-30"
        style={{
          left: tooltip ? tooltip.x + 14 : -9999,
          top: tooltip ? tooltip.y + 14 : -9999,
          transition: 'transform 120ms ease, opacity 120ms ease',
        }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: tooltip ? 1 : 0, scale: tooltip ? 1 : 0.98 }}
          transition={{ duration: 0.12 }}
          className="bg-white/8 text-white text-xs px-3 py-1 rounded-md backdrop-blur-sm border border-white/12 shadow-md"
        >
          {tooltip?.label}
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl md:text-4xl font-light text-white">
            About{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              Me
            </span>
          </h2>

          <button
            onClick={toggleCanvas}
            aria-pressed={darkCanvas}
            className="px-3 py-2 rounded-full text-sm bg-white/6 border border-white/10 text-white hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title={darkCanvas ? 'Canvas: Dark (solid background)' : 'Canvas: Cosmic (transparent)'}
          >
            {darkCanvas ? 'Dark Canvas' : 'Cosmic Canvas'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left - text & stats */}
          <motion.div
            initial={{ opacity: 0, x: -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Motivated software developer proficient in Java, Python, JavaScript, and C++ with
              hands-on experience building backend systems, database design, and RESTful APIs.
              I focus on scalable, maintainable systems and delivering clean, well-tested code.
            </p>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Passionate about problem-solving, DSA, and system design. I enjoy building complete
              features from prototype to production and continuously improving performance and UX.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Years Experience', value: years },
                { label: 'Projects Completed', value: projects, suffix: '+' },
                { label: 'Companies Worked', value: companies },
                { label: 'Technologies', value: techs },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  whileHover={{ y: prefersReduced ? 0 : -6 }}
                  className="p-4 bg-white/5 rounded-xl border border-white/10"
                >
                  <div className="text-2xl md:text-3xl font-semibold text-white">
                    {s.value}
                    {s.suffix ?? ''}
                  </div>
                  <div className="text-sm text-gray-400">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-500/20"
              >
                View Projects
                <Icon icon="material-symbols:arrow-forward" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/10 text-gray-200 rounded-full hover:bg-white/6 focus:outline-none focus:ring-4 focus:ring-white/10"
              >
                Get In Touch
                <Icon icon="material-symbols:mail-outline" />
              </a>
            </div>
          </motion.div>

          {/* Right - avatar card */}
          <motion.div
            initial={{ opacity: 0, x: 28 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex justify-center items-center"
          >
            <div className="relative w-80 h-80 rounded-2xl border border-white/10 p-4 bg-gradient-to-br from-white/5 to-white/10">
              <motion.img
                src="https://res.cloudinary.com/dlyctssmy/image/upload/v1734845393/android-chrome-512x512_oh3h9a.png"
                alt="Chirag Sahani — profile photo"
                loading="lazy"
                className="w-72 h-72 object-cover rounded-lg"
                whileHover={{ scale: prefersReduced ? 1 : 1.05 }}
              />

              <motion.div
                className="absolute -top-4 -right-4 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                aria-hidden
              >
                <Icon icon="material-symbols:code" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: 0.4 }}
                aria-hidden
              >
                <Icon icon="material-symbols:palette" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Accessible scroll hint */}
      <a
        href="#projects"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-20"
        aria-label="Scroll to projects"
      >
        <motion.div
          className="text-gray-400 text-sm mb-2"
          animate={prefersReduced ? undefined : { y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon icon="material-symbols:keyboard-arrow-down" className="text-2xl" />
        </motion.div>
        <p className="text-gray-500 text-sm">Scroll to explore</p>
      </a>
    </section>
  );
}
