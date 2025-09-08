'use client';

import React, { Suspense, useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/* ===========================
   Floating particles component
   - responsive count via `count` prop
   - reacts to `speedMultiplier` and `color`
   =========================== */
function FloatingParticles({
  count,
  speedMultiplier,
  color,
}: {
  count: number;
  speedMultiplier: number;
  color: string;
}) {
  const pointsRef = useRef<THREE.Points>(null);

  // Create positions once for the given count
  const particlesPosition = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return positions;
  }, [count]);

  // Geometry pinned to memo
  const particlesGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(particlesPosition, 3));
    return geometry;
  }, [particlesPosition]);

  // Animate rotation / drift
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (pointsRef.current) {
      // base speed * multiplier
      pointsRef.current.rotation.y = t * 0.02 * speedMultiplier;
      pointsRef.current.rotation.x = Math.sin(t * 0.12) * 0.02 * speedMultiplier;
      // subtle z wobble
      pointsRef.current.position.z = Math.sin(t * 0.07) * 0.02;
    }
  });

  return (
    <points ref={pointsRef} geometry={particlesGeometry}>
      <pointsMaterial
        color={color}
        size={0.03}
        sizeAttenuation={true}
        transparent
        opacity={0.85}
      />
    </points>
  );
}

/* ===========================
   Floating geometric shapes
   - small performance conscious tweaks
   =========================== */
function FloatingGeometry({ hoverInfluence = 0 }: { hoverInfluence?: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      // rotation speed slightly increases when hovering
      const speed = 0.12 + hoverInfluence * 0.2;
      groupRef.current.rotation.y = t * speed;
      groupRef.current.rotation.x = Math.sin(t * 0.08) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[2, 1, 0]} rotation={[0.5, 0.5, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.85}
          emissive="#1e3a8a"
          emissiveIntensity={0.12}
        />
      </mesh>

      <mesh position={[-2, -1, 1]} rotation={[1, 0, 0.5]}>
        <octahedronGeometry args={[0.6]} />
        <meshStandardMaterial
          color="#06b6d4"
          transparent
          opacity={0.9}
          emissive="#0891b2"
          emissiveIntensity={0.12}
        />
      </mesh>

      <mesh position={[0, 2, -1]} rotation={[0, 1, 0]}>
        <tetrahedronGeometry args={[0.7]} />
        <meshStandardMaterial
          color="#8b5cf6"
          transparent
          opacity={0.85}
          emissive="#7c3aed"
          emissiveIntensity={0.12}
        />
      </mesh>

      <mesh position={[-1.5, 0.5, -2]} rotation={[0.8, 0.3, 0]}>
        <icosahedronGeometry args={[0.5]} />
        <meshStandardMaterial
          color="#10b981"
          transparent
          opacity={0.85}
          emissive="#059669"
          emissiveIntensity={0.12}
        />
      </mesh>
    </group>
  );
}

/* ===========================
   Wireframe Sphere (lightweight)
   =========================== */
function WireframeSphere({ visible = true }: { visible?: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.035;
    }
  });

  return visible ? (
    <mesh ref={meshRef} position={[0, 0, -3]}>
      <sphereGeometry args={[2, 24, 24]} /> {/* slightly lower segment counts for perf */}
      <meshBasicMaterial wireframe color="#00d4ff" transparent opacity={0.7} />
    </mesh>
  ) : null;
}

/* ===========================
   Main component with:
   - responsive particle count
   - dpr cap
   - pointer/touch interactions
   - optional performance tweaks for mobile
   =========================== */
export default function ThreeBackground() {
  const [darkMode, setDarkMode] = useState(true);

  // Interaction states
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [particleColor, setParticleColor] = useState('#00d4ff');
  const [hoverInfluence, setHoverInfluence] = useState(0);

  // responsive particle count
  const [particleCount, setParticleCount] = useState(() => {
    if (typeof window === 'undefined') return 3000;
    const w = window.innerWidth;
    if (w < 640) return 900; // mobile
    if (w < 1280) return 3000; // tablet / small laptop
    return 5000; // desktop
  });

  // update particle count on resize (debounced)
  useEffect(() => {
    let handle: number | null = null;
    const onResize = () => {
      if (handle) window.clearTimeout(handle);
      handle = window.setTimeout(() => {
        const w = window.innerWidth;
        if (w < 640) setParticleCount(900);
        else if (w < 1280) setParticleCount(3000);
        else setParticleCount(5000);
      }, 150);
    };
    window.addEventListener('resize', onResize);
    return () => {
      if (handle) window.clearTimeout(handle);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  // Pointer handlers: modify speed multiplier & color
  const onPointerEnter = useCallback(() => {
    // gentle increase
    setSpeedMultiplier(1.8);
    setParticleColor('#7be2ff'); // lighter/cooler color when hovered
    setHoverInfluence(1);
  }, []);

  const onPointerLeave = useCallback(() => {
    // revert smoothly
    setSpeedMultiplier(1);
    setParticleColor('#00d4ff');
    setHoverInfluence(0);
  }, []);

  // onPointerMove we can set speed based on distance from center (optional)
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    // e.clientX, e.clientY -> normalize to -1..1 relative to center
    const w = window.innerWidth;
    const h = window.innerHeight;
    const nx = (e.clientX / w) * 2 - 1;
    const ny = (e.clientY / h) * 2 - 1;
    // use magnitude to slightly increase speed
    const mag = Math.min(1.5, Math.sqrt(nx * nx + ny * ny) + 0.5);
    setSpeedMultiplier(1 + 0.9 * mag);
    setHoverInfluence(Math.min(1, mag));
  }, []);

  // touch handlers (for mobile): tap to temporarily increase speed
  useEffect(() => {
    let touchTimeout: number | null = null;
    const onTouchStart = () => {
      setSpeedMultiplier((s) => Math.max(1.2, s));
      setParticleColor('#9ff7ff');
      if (touchTimeout) window.clearTimeout(touchTimeout);
    };
    const onTouchEnd = () => {
      // revert after short delay
      touchTimeout = window.setTimeout(() => {
        setSpeedMultiplier(1);
        setParticleColor('#00d4ff');
      }, 400);
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd);
    return () => {
      if (touchTimeout) window.clearTimeout(touchTimeout);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, []);

  const cosmicUrl =
    'https://storage.googleapis.com/cosmic-generated-assets/backgrounds/4k/cosmic-bg-1jcart9krc.jpg';

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      {/* Background layer */}
      <div
        className="absolute inset-0 transition-colors duration-500"
        style={{
          backgroundImage: darkMode ? 'none' : `url('${cosmicUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundColor: darkMode ? '#000000' : undefined,
        }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 transition-opacity duration-500"
        style={{
          background:
            darkMode
              ? 'linear-gradient(180deg, rgba(0,0,0,0.85), rgba(0,0,0,0.95))'
              : 'linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45))',
        }}
      />

      {/* 3D Canvas
          - dpr capped for performance
          - gl.alpha toggled so when in "cosmic" mode canvas is transparent
          - pointer events handled at wrapper div to allow pointer interactions but keep rest of background pointer-events none
      */}
      <div
        // enable pointer events for interactions
        onPointerEnter={onPointerEnter}
        onPointerLeave={onPointerLeave}
        onPointerMove={onPointerMove}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'auto' }}
      >
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 1.5]} // cap device pixel ratio to 1.5 for perf
          gl={{ alpha: darkMode ? false : true }}
          style={{ width: '100%', height: '100%' }}
        >
          {darkMode && <color attach="background" args={['#000000']} />}

          <Suspense fallback={null}>
            <ambientLight intensity={0.35} />
            <directionalLight position={[10, 10, 5]} intensity={0.5} />
            <pointLight position={[-10, -10, -5]} intensity={0.45} color="#3b82f6" />
            <pointLight position={[10, -10, 5]} intensity={0.28} color="#8b5cf6" />

            {/* Pass color and speedMultiplier into particles */}
            <FloatingParticles
              count={particleCount}
              speedMultiplier={speedMultiplier}
              color={particleColor}
            />

            <FloatingGeometry hoverInfluence={hoverInfluence} />
            <WireframeSphere visible={!darkMode ? false : true} />
          </Suspense>
        </Canvas>
      </div>

      {/* Toggle button (top-right). pointer-events allowed only on this control */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto">
        <button
          onClick={() => setDarkMode((prev) => !prev)}
          className="flex items-center gap-3 rounded-full px-4 py-2 bg-white/8 backdrop-blur-sm border border-white/10 text-sm text-white hover:bg-white/16 transition-all duration-200"
          aria-pressed={darkMode}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
          >
            {darkMode ? (
              <path
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
              />
            ) : (
              <path
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 3v1m0 16v1m8.66-10.34h-1M4.34 12.66h-1M18.36 5.64l-.7.7M6.34 17.66l-.7.7M18.36 18.36l-.7-.7M6.34 6.34l-.7-.7M12 7a5 5 0 100 10 5 5 0 000-10z"
              />
            )}
          </svg>

          <span className="sr-only">Toggle theme</span>
          <span>{darkMode ? 'Dark' : 'Cosmic'}</span>
        </button>
      </div>
    </div>
  );
}
