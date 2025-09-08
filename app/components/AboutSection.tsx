'use client';

import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';

/* ----------------------
   Floating Tech Icons
   ---------------------- */
const TECH_ICONS = [
  { id: 'react', label: 'React', color: '#61DAFB', position: [2, 1, 0] },
  { id: 'next', label: 'Next.js', color: '#FFFFFF', position: [-2, 0.6, 1] },
  { id: 'three', label: 'Three.js', color: '#049EF4', position: [1.5, -1, -1] },
  { id: 'ts', label: 'TypeScript', color: '#3178C6', position: [-1.5, 1.2, 0.5] },
  { id: 'node', label: 'Node.js', color: '#68A063', position: [0, -1.6, 1.5] },
];

function FloatingTechIcons({
  onHover,
  onMove,
  onLeave,
}: {
  onHover: (label: string, x: number, y: number) => void;
  onMove: (x: number, y: number) => void;
  onLeave: () => void;
}) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.06;
    groupRef.current.rotation.x = Math.sin(t * 0.12) * 0.02;

    groupRef.current.children.forEach((c, i) => {
      c.position.y += Math.sin(t * 0.5 + i) * 0.0005;
    });
  });

  return (
    <group ref={groupRef}>
      {TECH_ICONS.map((ic) => (
        <mesh
          key={ic.id}
          position={ic.position as [number, number, number]}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHover(ic.label, e.clientX, e.clientY);
            const m = e.object as THREE.Mesh;
            m.scale.set(1.18, 1.18, 1.18);
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
        >
          <boxGeometry args={[0.6, 0.6, 0.12]} />
          <meshStandardMaterial
            color={ic.color}
            roughness={0.25}
            metalness={0.6}
            emissive="#000000"
            transparent
          />
        </mesh>
      ))}
    </group>
  );
}

/* ----------------------
   Decorative Sphere
   ---------------------- */
function DecorativeSphere({ visible = true }: { visible?: boolean }) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.y = t * 0.03;
    ref.current.rotation.x = Math.sin(t * 0.02) * 0.01;
  });

  return visible ? (
    <mesh ref={ref} position={[0, -0.25, -2.5]}>
      <sphereGeometry args={[1.8, 16, 16]} />
      <meshStandardMaterial color="#0ea5e9" transparent opacity={0.06} />
    </mesh>
  ) : null;
}

/* ----------------------
   CountUp Hook
   ---------------------- */
function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const start = performance.now();
    let raf = 0;

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
   About Section
   ---------------------- */
export default function AboutSection() {
  const [tooltip, setTooltip] = useState<{ label: string; x: number; y: number } | null>(null);
  const [darkCanvas, setDarkCanvas] = useState(true);

  const years = useCountUp(1, 900);
  const projects = useCountUp(50, 1400);
  const companies = useCountUp(2, 900);
  const techs = useCountUp(15, 1000);

  const onIconHover = useCallback((label: string, x: number, y: number) => {
    setTooltip({ label, x, y });
  }, []);

  const onIconMove = useCallback((x: number, y: number) => {
    setTooltip((t) => (t ? { ...t, x, y } : t));
  }, []);

  const onIconLeave = useCallback(() => setTooltip(null), []);

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-black">
      {/* Background Canvas */}
      <div className="absolute inset-0 opacity-85 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 6] }}>
          {darkCanvas && <color attach="background" args={['#000']} />}
          <ambientLight intensity={0.6} />
          <directionalLight position={[6, 6, 6]} intensity={0.7} />
          <pointLight position={[-6, -6, -6]} intensity={0.5} color="#3b82f6" />
          <pointLight position={[6, -6, 6]} intensity={0.4} color="#8b5cf6" />
          <Suspense fallback={null}>
            <FloatingTechIcons onHover={onIconHover} onMove={onIconMove} onLeave={onIconLeave} />
            <DecorativeSphere />
          </Suspense>
        </Canvas>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          role="tooltip"
          className="absolute z-30 bg-white/10 text-white text-xs px-3 py-1 rounded-md backdrop-blur-sm border border-white/20 shadow-md"
          style={{ left: tooltip.x + 14, top: tooltip.y + 14 }}
        >
          {tooltip.label}
        </div>
      )}

      {/* Content */}
      <div className="relative z-20 max-w-6xl mx-auto px-6">
        <div className="flex justify-between items-start mb-8">
          <h2 className="text-3xl md:text-4xl font-light text-white">
            About{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-400">
              Me
            </span>
          </h2>
          <button
            onClick={() => setDarkCanvas((d) => !d)}
            className="px-3 py-2 rounded-full text-sm bg-white/10 border border-white/20 text-white hover:bg-white/20"
          >
            {darkCanvas ? 'Dark Canvas' : 'Cosmic Canvas'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Left Text */}
          <motion.div initial={{ opacity: 0, x: -36 }} whileInView={{ opacity: 1, x: 0 }}>
            <p className="text-lg text-gray-300 mb-6">
              Motivated software developer proficient in Java, Python, JavaScript, and C++ with
              hands-on experience building backend systems, database design, and RESTful APIs. I
              focus on scalable, maintainable systems and delivering clean code.
            </p>
            <p className="text-lg text-gray-300 mb-8">
              Passionate about problem-solving, DSA, and system design. Always exploring new tools
              and applying them to real-world projects.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[{ label: 'Years Experience', value: years },
                { label: 'Projects Completed', value: projects },
                { label: 'Companies Worked', value: companies },
                { label: 'Technologies', value: techs }].map((s) => (
                <motion.div
                  key={s.label}
                  className="p-4 bg-white/5 rounded-xl border border-white/10"
                  whileHover={{ y: -5 }}
                >
                  <div className="text-2xl font-semibold text-white">
                    {s.value}
                    {s.label.includes('Projects') && '+'}
                  </div>
                  <div className="text-sm text-gray-400">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right Avatar */}
          <motion.div initial={{ opacity: 0, x: 36 }} whileInView={{ opacity: 1, x: 0 }}>
            <div className="relative w-80 h-80 rounded-2xl border border-white/10 p-4 bg-gradient-to-br from-white/5 to-white/10">
              <motion.img
                src="https://res.cloudinary.com/dlyctssmy/image/upload/v1734845393/android-chrome-512x512_oh3h9a.png"
                alt="Chirag Sahani"
                className="w-72 h-72 object-cover rounded-lg"
                whileHover={{ scale: 1.05 }}
              />
              <motion.div
                className="absolute -top-4 -right-4 w-14 h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 text-white"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Icon icon="material-symbols:code" />
              </motion.div>
              <motion.div
                className="absolute -bottom-4 -left-4 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-400 to-pink-500 text-white"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2.4, repeat: Infinity }}
              >
                <Icon icon="material-symbols:palette" />
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
