'use client';

import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

/* ===========================
   Floating tech icons (interactive)
   - simple meshes with pointer handlers
   - expose pointer position & label to show tooltip
   - lightweight geometry & materials
   =========================== */
function FloatingTechIcons({
  onHover,
  onMove,
  onLeave,
}: {
  onHover: (label: string, screenX: number, screenY: number) => void;
  onMove: (screenX: number, screenY: number) => void;
  onLeave: () => void;
}) {
  const groupRef = useRef<THREE.Group | null>(null);

  // Basic icon definitions — keeps them lightweight
  const icons = [
    { id: 'react', label: 'React', color: '#61DAFB', position: [2, 1, 0] },
    { id: 'next', label: 'Next.js', color: '#FFFFFF', position: [-2, 0.6, 1] },
    { id: 'three', label: 'Three.js', color: '#049EF4', position: [1.5, -1, -1] },
    { id: 'ts', label: 'TypeScript', color: '#3178C6', position: [-1.5, 1.2, 0.5] },
    { id: 'node', label: 'Node.js', color: '#68A063', position: [0, -1.6, 1.5] },
  ];

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    // slow rotation for interest
    groupRef.current.rotation.y = t * 0.06;
    groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.02;
    // gentle bob up/down
    groupRef.current.children.forEach((c, idx) => {
      // subtle local transform per-item
      c.position.y += Math.sin(t * 0.5 + idx) * 0.0005;
    });
  });

  // create simple box icon components that accept pointer events
  return (
    <group ref={groupRef}>
      {icons.map((ic) => (
        <mesh
          key={ic.id}
          position={ic.position as [number, number, number]}
          // pointer events for hover
          onPointerOver={(e) => {
            // stop event propagation so page doesn't treat it as scroll
            e.stopPropagation();
            // convert pointer event to screen coords
            onHover(ic.label, e.clientX, e.clientY);
            // scale up slightly
            const m = e.object as THREE.Mesh;
            m.scale.set(1.18, 1.18, 1.18);
            // subtle emissive boost
            (m.material as THREE.MeshStandardMaterial).emissive = new THREE.Color(ic.color);
          }}
          onPointerMove={(e) => {
            e.stopPropagation();
            onMove(e.clientX, e.clientY);
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onLeave();
            const m = e.object as THREE.Mesh;
            m.scale.set(1, 1, 1);
            (m.material as THREE.MeshStandardMaterial).emissive = new THREE.Color('#000000');
          }}
          castShadow={false}
          receiveShadow={false}
        >
          <boxGeometry args={[0.6, 0.6, 0.12]} />
          <meshStandardMaterial
            color={ic.color}
            roughness={0.25}
            metalness={0.6}
            emissive="#000000"
            transparent
            opacity={1}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ===========================
   Lightweight decorative sphere
   =========================== */
function DecorativeSphere({ visible = true }: { visible?: boolean }) {
  const ref = useRef<THREE.Mesh | null>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.y = state.clock.elapsedTime * 0.03;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.01;
  });
  return visible ? (
    <mesh ref={ref} position={[0, -0.25, -2.5]}>
      <sphereGeometry args={[1.8, 20, 20]} />
      <meshStandardMaterial color="#0ea5e9" transparent opacity={0.06} />
    </mesh>
  ) : null;
}

/* ===========================
   CountUp hook for stats
   =========================== */
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const startTime = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = Math.min(1, (now - startTime) / duration);
      const ease = 1 - Math.pow(1 - elapsed, 3); // easeOutCubic
      setValue(Math.round(ease * target));
      if (elapsed < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

/* ===========================
   Main enhanced AboutSection
   =========================== */
export default function AboutSection() {
  // tooltip info (label + screen coords)
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);

  // whether the canvas should be opaque (for accessibility/dark mode)
  const [darkCanvas, setDarkCanvas] = useState(true);

  // animated stat values
  const years = useCountUp(1, 900);
  const projects = useCountUp(50, 1400);
  const companies = useCountUp(2, 900);
  const techs = useCountUp(15, 1000);

  // handlers from FloatingTechIcons
  const onIconHover = useCallback((label: string, screenX: number, screenY: number) => {
    setTooltip({ label, x: screenX, y: screenY });
  }, []);

  const onIconMove = useCallback((screenX: number, screenY: number) => {
    setTooltip((t) => (t ? { ...t, x: screenX, y: screenY } : t));
  }, []);

  const onIconLeave = useCallback(() => setTooltip(null), []);

  // small accessibility: allow keyboard users to toggle canvas dark mode
  const toggleCanvasMode = () => setDarkCanvas((s) => !s);

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-black">
      {/* Background canvas (absolute) */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{ opacity: 0.85 }}
      >
        <Canvas
          camera={{ position: [0, 0, 6] }}
          dpr={[1, 1.5]}
          gl={{ antialias: true, alpha: !darkCanvas }}
          style={{ width: '100%', height: '100%' }}
        >
          {/* if darkCanvas, set background color for legibility */}
          {darkCanvas && <color attach="background" args={['#000000']} />}

          <ambientLight intensity={0.6} />
          <directionalLight position={[6, 6, 6]} intensity={0.7} />
          <pointLight position={[-6, -6, -6]} intensity={0.5} color="#3b82f6" />
          <pointLight position={[6, -6, 6]} intensity={0.4} color="#8b5cf6" />

          <Suspense fallback={null}>
            <FloatingTechIcons onHover={onIconHover} onMove={onIconMove} onLeave={onIconLeave} />
            <DecorativeSphere visible={true} />
          </Suspense>
        </Canvas>
      </div>

      {/* Tooltip HTML overlay (follows pointer) */}
      {tooltip && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-none absolute z-30"
          style={{
            left: tooltip.x + 14,
            top: tooltip.y + 14,
            transform: 'translate3d(0,0,0)',
          }}
        >
          <div className="bg-white/9 text-white text-xs px-3 py-1 rounded-md backdrop-blur-sm border border-white/10 shadow-lg">
            {tooltip.label}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 relative z-20">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl md:text-4xl font-light text-white">
            About <span className="block bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">Me</span>
          </h2>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleCanvasMode}
              className="px-3 py-2 rounded-full text-sm bg-white/6 border border-white/10 text-white hover:bg-white/12 transition"
              aria-pressed={darkCanvas}
              title={darkCanvas ? 'Canvas: Dark (solid background)' : 'Canvas: Cosmic (transparent)'}
            >
              {darkCanvas ? 'Dark Canvas' : 'Cosmic Canvas'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left: text & stats */}
          <motion.div
            initial={{ opacity: 0, x: -36 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              Motivated software developer proficient in Java, Python, JavaScript, and C++ with hands-on experience building backend systems (Node.js / Express, Flask), database design (Postgres, MongoDB), and RESTful APIs. I focus on building scalable, maintainable systems and delivering clear, well-tested code in collaborative teams.
            </p>

            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Passionate about problem-solving, data structures & algorithms, and system design. I enjoy learning new technologies and applying them to real problems — from prototyping to production.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Years Experience', value: years },
                { label: 'Projects Completed', value: projects },
                { label: 'Companies Worked', value: companies },
                { label: 'Technologies', value: techs },
              ].map((s) => (
                <motion.div
                  key={s.label}
                  whileHover={{ translateY: -6, scale: 1.02 }}
                  className="p-4 bg-white/3 backdrop-blur-sm rounded-xl border border-white/6"
                >
                  <div className="text-2xl md:text-3xl font-semibold text-white">{s.value}{s.label.includes('Projects') && '+'}</div>
                  <div className="text-sm text-gray-400">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 flex gap-4">
              <a
                href="#projects"
                className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:scale-105 transition"
              >
                View Projects
                <Icon icon="material-symbols:arrow-forward" />
              </a>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-5 py-3 border border-white/10 text-gray-200 rounded-full hover:bg-white/6 transition"
              >
                Get In Touch
                <Icon icon="material-symbols:mail-outline" />
              </a>
            </div>
          </motion.div>

          {/* Right: avatar card with 3D depth feel */}
          <motion.div
            initial={{ opacity: 0, x: 36 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="flex justify-center items-center"
          >
            <div
              className="relative w-80 h-80 rounded-2xl bg-gradient-to-br from-white/4 to-white/2 border border-white/6 p-4"
              // small parallax on hover using framer-motion
            >
              <motion.div
                className="w-full h-full rounded-xl overflow-hidden shadow-xl bg-gradient-to-br from-blue-800/20 to-purple-800/12 flex items-center justify-center"
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.3 }}
              >
                <img
                  src="https://res.cloudinary.com/dlyctssmy/image/upload/v1734845393/android-chrome-512x512_oh3h9a.png"
                  alt="Chirag Sahani Profile"
                  loading="lazy"
                  className="w-72 h-72 object-cover rounded-lg"
                  width={288}
                  height={288}
                />
              </motion.div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 w-14 h-14 rounded-full flex items-center justify-center bg-gradient-to-br from-cyan-400 to-blue-500 text-white shadow"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                aria-hidden
              >
                <Icon icon="material-symbols:code" />
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br from-purple-400 to-pink-500 text-white shadow"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.4, repeat: Infinity, delay: 0.6 }}
                aria-hidden
              >
                <Icon icon="material-symbols:palette" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* scroll indicator — accessible */}
      <a
        href="#projects"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
        aria-label="Scroll to projects"
      >
        <motion.div
          className="text-gray-400 text-sm mb-2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon icon="material-symbols:keyboard-arrow-down" className="text-2xl" />
        </motion.div>
        <p className="text-gray-500 text-sm">Scroll to explore</p>
      </a>
    </section>
  );
}
