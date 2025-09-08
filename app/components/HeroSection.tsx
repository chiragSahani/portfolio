'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Text, OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import * as THREE from 'three';

/* ===========================
   Interactive 3D Logo
   =========================== */
function Interactive3DLogo() {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    meshRef.current.rotation.x = Math.sin(t) * 0.25;
    meshRef.current.rotation.y = Math.sin(t * 0.8) * 0.35;
    meshRef.current.position.y = Math.sin(t * 1.5) * 0.12;
  });

  return (
    <Sphere
      ref={meshRef}
      args={[1, 64, 32]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.15 : 1}
    >
      <MeshDistortMaterial
        color={hovered ? '#06b6d4' : '#3b82f6'}
        attach="material"
        distort={1.2}
        speed={3}
        roughness={0}
        transparent
        opacity={1}
        emissive={hovered ? '#0ea5e9' : '#2563eb'}
        emissiveIntensity={hovered ? 0.9 : 0.6}
      />
    </Sphere>
  );
}

/* ===========================
   Floating Code Symbols
   =========================== */
function FloatingCode() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.rotation.y = t * 0.1;
  });

  const codeSymbols = ['<>', '{}', '[]', '()', '/>', '==='];

  return (
    <group ref={groupRef}>
      {codeSymbols.map((symbol, index) => {
        const angle = (index / codeSymbols.length) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <Text
            key={symbol}
            position={[x, Math.sin(index) * 0.5, z]}
            fontSize={0.42}
            color="#00d4ff"
            anchorX="center"
            anchorY="middle"
          >
            {symbol}
            <meshStandardMaterial
              color="#00d4ff"
              emissive="#0891b2"
              emissiveIntensity={0.5}
              transparent
              opacity={0.9}
            />
          </Text>
        );
      })}
    </group>
  );
}

/* ===========================
   HeroSection Main Component
   =========================== */
export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black opacity-90 z-0" />

      {/* 3D Canvas */}
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          dpr={[1, 1.5]} // performance-friendly
        >
          <color attach="background" args={['#000000']} />
          <Suspense fallback={null}>
            <ambientLight intensity={0.8} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} />
            <pointLight position={[-10, -10, -5]} intensity={0.9} color="#3b82f6" />
            <pointLight position={[10, -10, 5]} intensity={0.7} color="#8b5cf6" />
            <pointLight position={[0, 5, 3]} intensity={0.5} color="#06b6d4" />

            <Interactive3DLogo />
            <FloatingCode />
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              autoRotate
              autoRotateSpeed={0.5}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-10"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-light text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
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
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Hey 👋 I’m <span className="text-cyan-400 font-medium">Chirag Sahani</span>, passionate
            about problem-solving, DSA, algorithms, and system design — with a proven track record in
            competitive coding and full-stack app development.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row gap-5 justify-center items-center mb-14"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <motion.a
            href="#projects"
            className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-medium text-lg shadow-2xl overflow-hidden"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="relative z-10 flex items-center gap-2">
              View My Work
              <Icon icon="material-symbols:arrow-forward" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.a>

          <motion.a
            href="#contact"
            className="group px-8 py-4 border border-gray-400/40 text-gray-300 hover:text-white rounded-full font-medium text-lg hover:border-white transition-all duration-300"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="flex items-center gap-2">
              Get In Touch
              <Icon icon="material-symbols:mail-outline" />
            </span>
          </motion.a>
        </motion.div>

        {/* Social Links */}
        <motion.div
          className="flex gap-6 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {[
            { icon: 'mdi:github', href: 'https://github.com/chiragSahani', label: 'GitHub' },
            { icon: 'mdi:linkedin', href: 'https://www.linkedin.com/in/chiragsahani/', label: 'LinkedIn' },
            { icon: 'mdi:email', href: 'mailto:chiragsahani@example.com', label: 'Email' },
          ].map((social, index) => (
            <motion.a
              key={social.icon}
              href={social.href}
              aria-label={social.label}
              className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
              whileHover={{ scale: 1.15, y: -3 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
            >
              <Icon icon={social.icon} className="text-xl" />
              {/* Glow ring effect */}
              <span className="absolute inset-0 rounded-full border border-cyan-400/20 group-hover:border-cyan-400/40 transition" />
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.a
          href="#about"
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <motion.div
            className="text-gray-400 text-sm mb-2"
            animate={{ y: [0, 10, 0], opacity: [0.6, 1, 0.6] }}
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
