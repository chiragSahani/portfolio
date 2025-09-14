'use client';

import React, { Suspense, useRef, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text, Sphere } from '@react-three/drei';
import { motion, useReducedMotion } from 'framer-motion';
import { Icon } from '@iconify/react';
import * as THREE from 'three';

/* ------------------------
   Helpers
   ------------------------ */
// Hook: detect element on screen (simple IntersectionObserver)
function useOnScreen<T extends Element>(ref: React.RefObject<T>, rootMargin = '0px') {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => setIntersecting(entries[0].isIntersecting),
      { root: null, rootMargin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return isIntersecting;
}

/* ------------------------
   Interactive 3D Logo (lighter)
   ------------------------ */
function Interactive3DLogo({ pulse = true, visible = true }: { pulse?: boolean; visible?: boolean }) {
  const meshRef = useRef<THREE.Mesh | null>(null);
  const prefersReduced = useReducedMotion();

  if (!visible) return null;

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = Math.sin(t * (prefersReduced ? 0.2 : 1.0)) * 0.2;
    meshRef.current.rotation.y = Math.sin(t * (prefersReduced ? 0.2 : 0.8)) * 0.3;
    meshRef.current.position.y = (prefersReduced ? 0 : Math.sin(t * 1.4) * 0.08);
    if (pulse) {
      // subtle emissive pulse
      const m = meshRef.current.material as THREE.MeshStandardMaterial;
      if (m) m.emissiveIntensity = 0.08 + Math.abs(Math.sin(t * 1.3)) * 0.25;
    }
  });

  // lower segment counts for perf
  return (
    <Sphere ref={meshRef} args={[1, 16, 12]}>
      <meshStandardMaterial
        color="#3b82f6"
        roughness={0.5}
        metalness={0.3}
        transparent
        opacity={0.95}
        emissive="#0ea5e9"
        emissiveIntensity={0.12}
      />
    </Sphere>
  );
}

/* ------------------------
   Floating code symbols (optimized)
   ------------------------ */
function FloatingCode({ disabled = false, visible = true }: { disabled?: boolean; visible?: boolean }) {
  const groupRef = useRef<THREE.Group | null>(null);
  const prefersReduced = useReducedMotion();

  if (!visible || disabled) return null;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * (prefersReduced ? 0.02 : 0.08);
    // tiny bob for each child
    groupRef.current.children.forEach((c, i) => {
      c.position.y = Math.sin(t * 1.3 + i) * 0.12;
    });
  });

  const symbols = ['<>', '{}', '[]', '()'];

  return (
    <group ref={groupRef}>
      {symbols.map((s, i) => {
        const angle = (i / symbols.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <Text
            key={s}
            position={[x, 0, z]}
            fontSize={0.35}
            color="#00d4ff"
            anchorX="center"
            anchorY="middle"
          >
            {s}
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#0891b2"
              emissiveIntensity={0.25}
              transparent
              opacity={0.95}
            />
          </Text>
        );
      })}
    </group>
  );
}

/* ------------------------
   Main HeroSection
   ------------------------ */
export default function HeroSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isVisible = useOnScreen(sectionRef, '-200px'); // lazy-mount canvas when hero enters viewport
  const [show3D, setShow3D] = useState(true); // performance toggle
  const prefersReduced = useReducedMotion();

  // Performance monitoring
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useEffect(() => {
    const checkPerformance = () => {
      frameCount.current++;
      const now = performance.now();
      
      if (now - lastTime.current >= 2000) {
        const currentFps = Math.round((frameCount.current * 1000) / (now - lastTime.current));
        setFps(currentFps);
        
        // Auto-disable 3D if performance is poor
        if (currentFps < 25) {
          setShow3D(false);
        }
        
        frameCount.current = 0;
        lastTime.current = now;
      }
      
      if (show3D) {
        requestAnimationFrame(checkPerformance);
      }
    };
    
    if (show3D) {
      requestAnimationFrame(checkPerformance);
    }
  }, [show3D]);

  // keyboard accessible CTA handler
  const handleCTAClick = useCallback((href: string) => {
    const el = document.querySelector(href) as HTMLElement | null;
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    el.focus({ preventScroll: true });
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black"
      aria-label="Hero"
    >
      {/* Gradient overlay (keeps text legible) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/95" />
      </div>

      {/* 3D Canvas (lazy mount for perf) */}
      <div className="absolute inset-0 z-0">
        {isVisible && show3D ? (
          <Canvas
            camera={{ position: [0, 0, 5], fov: 60 }}
            dpr={[1, Math.min(window.devicePixelRatio, 2)]}
            gl={{ 
              antialias: false, 
              alpha: false,
              powerPreference: 'high-performance',
              preserveDrawingBuffer: false
            }}
            style={{ width: '100%', height: '100%' }}
            frameloop={prefersReduced ? 'never' : 'always'}
          >
            {/* solid background color for consistent contrast */}
            <color attach="background" args={['#000000']} />

            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.6} />

            <Suspense fallback={null}>
              <Interactive3DLogo pulse={!prefersReduced} visible={show3D} />
              <FloatingCode disabled={prefersReduced} visible={show3D} />
            </Suspense>
          </Canvas>
        ) : null}
      </div>

      {/* Content (z-10) */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        {/* Top controls: theme toggle (accessible) */}
        <div className="absolute top-6 right-6 z-20">
          <button
            onClick={() => setShow3D((s) => !s)}
            aria-pressed={show3D}
            aria-label={show3D ? '3D effects (on)' : '3D effects (off)'}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/6 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400 transition"
            title="Toggle 3D effects"
          >
            <Icon icon={show3D ? 'mdi:cube-outline' : 'mdi:cube-off-outline'} />
            <span className="sr-only">Toggle 3D</span>
            <span className="text-xs">{fps}fps</span>
          </button>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.12 }}
          >
            Full Stack<span className="text-blue-400">&gt;</span>
            <span className="block bg-gradient-to-r from-blue-400 via-purple-500 to-cyan-400 bg-clip-text text-transparent drop-shadow-lg">
              Developer
            </span>
          </motion.h1>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.26 }}
          >
            Hey 👋 I’m <span className="text-cyan-400 font-medium">Chirag Sahani</span>, passionate
            about problem-solving, DSA, algorithms, and system design — with a proven track record in
            competitive coding and full-stack app development.
          </motion.p>
        </motion.div>

        {/* CTAs */}
        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.button
            onClick={() => handleCTAClick('#projects')}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleCTAClick('#projects'); }}
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium text-lg shadow-2xl overflow-hidden focus:outline-none focus:ring-4 focus:ring-blue-500/30"
            whileHover={!prefersReduced ? { scale: 1.05, y: -2 } : {}}
            whileTap={!prefersReduced ? { scale: 0.96 } : {}}
            aria-label="View my work"
          >
            <span className="relative z-10 flex items-center gap-2">
              View My Work
              <Icon icon="material-symbols:arrow-forward" />
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.button>

          <motion.a
            href="mailto:chiragsahani@example.com"
            className="group px-8 py-4 border border-gray-400/40 text-gray-300 hover:text-white rounded-full font-medium text-lg hover:border-white transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-white/10"
            whileHover={!prefersReduced ? { scale: 1.05, y: -2 } : {}}
            whileTap={!prefersReduced ? { scale: 0.96 } : {}}
            aria-label="Send me an email"
          >
            <span className="flex items-center gap-2">
              Get In Touch
              <Icon icon="material-symbols:mail-outline" />
            </span>
          </motion.a>
        </motion.div>

        {/* Social icons */}
        <motion.div
          className="flex gap-6 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {[
            { icon: 'mdi:github', href: 'https://github.com/chiragSahani', label: 'GitHub' },
            { icon: 'mdi:linkedin', href: 'https://www.linkedin.com/in/chiragsahani/', label: 'LinkedIn' },
            { icon: 'mdi:email', href: 'mailto:chiragsahani@example.com', label: 'Email' },
          ].map((s, i) => (
            <motion.a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400"
              whileHover={!prefersReduced ? { scale: 1.12, y: -3 } : {}}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + i * 0.08 }}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Icon icon={s.icon} className="text-xl" />
              <span className="absolute inset-0 rounded-full border border-cyan-400/20 transition" />
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#about"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center z-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          aria-label="Scroll to about section"
        >
          <motion.div
            className="text-gray-400 text-sm mb-2"
            animate={!prefersReduced ? { y: [0, 10, 0], opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Icon icon="material-symbols:keyboard-arrow-down" className="text-3xl" />
          </motion.div>
          <p className="text-gray-500 text-sm">Scroll to explore</p>
        </motion.a>
      </div>
    </section>
  );
}
