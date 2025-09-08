'use client';

import React, { Suspense, useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { motion } from 'framer-motion';
import { Icon } from '@iconify/react';
import * as THREE from 'three';

/* --------------------
   Helpers
   -------------------- */
// Hook to detect when an element is on screen
function useOnScreen<T extends Element>(ref: React.RefObject<T>, rootMargin = '0px') {
  const [isIntersecting, setIntersecting] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      (entries) => setIntersecting(entries[0].isIntersecting),
      { root: null, rootMargin }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, rootMargin]);
  return isIntersecting;
}

/* --------------------
   3D Skill Orb (emits pointer events)
   -------------------- */
function SkillOrb3D({
  name,
  position,
  color,
  onHover,
  onLeave,
}: {
  name: string;
  position: [number, number, number];
  color: string;
  onHover: (payload: { name: string; x: number; y: number }) => void;
  onLeave: () => void;
}) {
  const ref = useRef<THREE.Mesh | null>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x = Math.sin(t + position[0]) * 0.18;
    ref.current.rotation.y = Math.cos(t * 0.8 + position[1]) * 0.28;
    ref.current.position.y = position[1] + Math.sin(t * 1.9 + position[0]) * 0.08;
  });

  return (
    <mesh
      ref={ref}
      position={position}
      onPointerOver={(e: React.PointerEvent) => {
        e.stopPropagation();
        setHovered(true);
        onHover({ name, x: e.clientX, y: e.clientY });
      }}
      onPointerMove={(e: React.PointerEvent) => {
        e.stopPropagation();
        onHover({ name, x: e.clientX, y: e.clientY });
      }}
      onPointerOut={(e: React.PointerEvent) => {
        e.stopPropagation();
        setHovered(false);
        onLeave();
      }}
      scale={hovered ? 1.18 : 1}
      castShadow={false}
      receiveShadow={false}
    >
      <sphereGeometry args={[0.32, 28, 28]} />
      <meshStandardMaterial
        color={color}
        transparent
        opacity={0.88}
        emissive={hovered ? color : '#000000'}
        emissiveIntensity={hovered ? 0.6 : 0.18}
        roughness={0.25}
        metalness={0.3}
      />
    </mesh>
  );
}

/* --------------------
   Constellation (group of orbs) — memoized
   -------------------- */
function SkillConstellation3D({
  skills,
  onHover,
  onLeave,
}: {
  skills: { name: string; color: string; pos: [number, number, number] }[];
  onHover: (payload: { name: string; x: number; y: number }) => void;
  onLeave: () => void;
}) {
  // subtle group rotation
  const groupRef = useRef<THREE.Group | null>(null);
  useFrame((state) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.05) * 0.2;
    groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.02) * 0.05;
  });

  return (
    <group ref={groupRef}>
      {skills.map((s) => (
        <SkillOrb3D
          key={s.name}
          name={s.name}
          position={s.pos}
          color={s.color}
          onHover={onHover}
          onLeave={onLeave}
        />
      ))}
    </group>
  );
}

/* --------------------
   Data
   -------------------- */
type Skill = { name: string; level: number; icon: string; category: string };

const SKILLS: Skill[] = [
  { name: 'JavaScript', level: 90, icon: 'logos:javascript', category: 'Language' },
  { name: 'TypeScript', level: 85, icon: 'logos:typescript-icon', category: 'Language' },
  { name: 'Python', level: 80, icon: 'logos:python', category: 'Language' },
  { name: 'Java', level: 75, icon: 'logos:java', category: 'Language' },
  { name: 'C++', level: 70, icon: 'logos:c-plusplus', category: 'Language' },
  { name: 'React.js', level: 90, icon: 'logos:react', category: 'Frontend' },
  { name: 'Next.js', level: 85, icon: 'logos:nextjs-icon', category: 'Frontend' },
  { name: 'React Native', level: 85, icon: 'logos:react', category: 'Frontend' },
  { name: 'Tailwind CSS', level: 90, icon: 'logos:tailwindcss-icon', category: 'Frontend' },
  { name: 'Node.js', level: 85, icon: 'logos:nodejs-icon', category: 'Backend' },
  { name: 'Express.js', level: 85, icon: 'logos:express', category: 'Backend' },
  { name: 'Flask', level: 75, icon: 'logos:flask', category: 'Backend' },
  { name: 'PostgreSQL', level: 80, icon: 'logos:postgresql', category: 'Database' },
  { name: 'MongoDB', level: 75, icon: 'logos:mongodb-icon', category: 'Database' },
  { name: 'MySQL', level: 80, icon: 'logos:mysql', category: 'Database' },
  { name: 'Supabase', level: 70, icon: 'logos:supabase-icon', category: 'Database' },
  { name: 'Azure', level: 75, icon: 'logos:azure-icon', category: 'DevOps' },
  { name: 'Docker', level: 70, icon: 'logos:docker-icon', category: 'DevOps' },
  { name: 'Automation', level: 80, icon: 'mdi:cogs', category: 'DevOps' },
  { name: 'CI/CD', level: 65, icon: 'mdi:rocket-launch', category: 'DevOps' },
  { name: 'Git', level: 90, icon: 'logos:git-icon', category: 'Version Control' },
  { name: 'Three.js/WebGL', level: 80, icon: 'logos:threejs', category: 'Graphics' },
  { name: 'Generative AI', level: 80, icon: 'mdi:brain', category: 'AI/ML' },
  { name: 'RAG', level: 75, icon: 'mdi:file-document-outline', category: 'AI/ML' },
];

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Language', 'Graphics', 'Database', 'DevOps', 'Version Control', 'AI/ML'];

/* --------------------
   Main Component
   -------------------- */
export default function SkillsSection() {
  const ref = useRef<HTMLElement | null>(null);
  const isVisible = useOnScreen(ref, '-200px');

  // Tooltip state (HTML overlay that follows pointer)
  const [tooltip, setTooltip] = useState<{ name: string; x: number; y: number } | null>(null);

  // Category filter
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Build the 3D skill list with positions & colors (memoized)
  const skillOrbs = useMemo(() => {
    // choose a subset of skills to show in 3D constellation (keeps it balanced)
    const pick = SKILLS.slice(0, 8).map((s, i) => {
      // map index to a spherical-ish layout
      const angle = (i / 8) * Math.PI * 2;
      const radius = 2.2;
      return {
        name: s.name,
        color:
          s.name.toLowerCase().includes('react') ? '#61DAFB' :
          s.name.toLowerCase().includes('node') ? '#68A063' :
          s.name.toLowerCase().includes('python') ? '#3776AB' :
          s.name.toLowerCase().includes('typescript') ? '#3178C6' :
          s.name.toLowerCase().includes('three') ? '#049EF4' : '#10b981',
        pos: [Math.cos(angle) * radius, (i % 3) * 0.6 - 0.6, Math.sin(angle) * radius] as [number, number, number],
      };
    });
    return pick;
  }, []);

  const filteredSkills = selectedCategory === 'All' ? SKILLS : SKILLS.filter((s) => s.category === selectedCategory);

  // pointer callbacks from 3D orbs
  const handleOrbHover = useCallback((payload: { name: string; x: number; y: number }) => {
    setTooltip(payload);
  }, []);
  const handleOrbLeave = useCallback(() => setTooltip(null), []);

  // keyboard: accessible skill cards (for screen readers / keyboard users)
  const onKeyOpen = (skillName: string) => {
    // simple action — show tooltip centered
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    setTooltip({ name: skillName, x: centerX, y: centerY });
    setTimeout(() => setTooltip(null), 1500);
  };

  return (
    <section id="skills" ref={ref} className="py-24 relative overflow-hidden bg-black/60 backdrop-blur-sm" aria-labelledby="skills-heading">
      {/* 3D Background — lazy mount only when visible */}
      <div className="absolute inset-0 opacity-40 pointer-events-auto">
        {isVisible ? (
          <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]} style={{ width: '100%', height: '100%' }} gl={{ antialias: true, alpha: true }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.6} />
              <directionalLight position={[8, 8, 6]} intensity={0.9} />
              <pointLight position={[-8, -6, -4]} intensity={0.45} color="#3b82f6" />
              <pointLight position={[6, -4, 4]} intensity={0.3} color="#8b5cf6" />

              <SkillConstellation3D skills={skillOrbs} onHover={handleOrbHover} onLeave={handleOrbLeave} />
            </Suspense>
          </Canvas>
        ) : null}
      </div>

      {/* HTML Tooltip — follows pointer over 3D orbs */}
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
          <div className="bg-white/9 text-white text-sm px-3 py-1 rounded-md backdrop-blur-sm border border-white/10 shadow">
            {tooltip.name}
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
          <h2 id="skills-heading" className="text-4xl md:text-5xl font-light text-white mb-3">
            Technical <span className="block bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">Skills</span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">Proficient in modern technologies and frameworks — constantly learning and adapting.</p>
        </motion.div>

        {/* category filters */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:ring-2 focus:ring-cyan-400 transition ${
                selectedCategory === cat ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              aria-pressed={selectedCategory === cat}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Skills list (accessible) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredSkills.map((skill, idx) => (
            <motion.div key={skill.name} className="group" initial={{ opacity: 0, x: idx % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: idx * 0.03 }} viewport={{ once: true }}>
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-5 flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg flex items-center justify-center text-xl">
                    <Icon icon={skill.icon} className="text-2xl" />
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{skill.name}</h3>
                    <span className="text-xs text-gray-400">{skill.category}</span>
                  </div>
                </div>

                <div className="flex-1 ml-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="sr-only">{skill.name} proficiency</span>
                    <span className="text-white font-medium">{skill.level}%</span>
                  </div>
                  <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-500 to-purple-500" initial={{ width: 0 }} whileInView={{ width: `${skill.level}%` }} transition={{ duration: 1.2 }} viewport={{ once: true }} />
                  </div>
                </div>

                {/* small keyboard action to highlight orb (accessible fallback) */}
                <button
                  onClick={() => onKeyOpen(skill.name)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onKeyOpen(skill.name); } }}
                  className="ml-4 p-2 rounded-md bg-white/6 text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                  aria-label={`Highlight ${skill.name}`}
                >
                  <Icon icon="material-symbols:visibility" className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* experience cards */}
        <motion.div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true }}>
          {[
            {
              title: 'Software Development Engineer',
              description: 'Trao AI | Remote | Aug 2025 – Present. Building AI-powered products with React, Next.js, Node.js and MongoDB. Designing scalable APIs and optimizing performance.',
              icon: 'mdi:robot-outline',
            },
            {
              title: 'Associate Solution Engineer Intern',
              description: 'NxtWave | Hyderabad | June 2025 – Aug 2025. Built scalable full-stack web applications and contributed to API design.',
              icon: 'mdi:code-braces',
            },
            {
              title: 'Software Development Intern',
              description: 'UpGrad Edtech | Bangalore | Oct 2024 – Feb 2025. Created engineering content and coding challenges; used GenAI tools to optimize workflows.',
              icon: 'mdi:file-document-edit-outline',
            },
          ].map((item) => (
            <motion.div key={item.title} className="text-center p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition" whileHover={{ y: -6, scale: 1.02 }}>
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon icon={item.icon} className="text-white text-2xl" />
              </div>
              <h3 className="text-white font-medium mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm">{item.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a href="#contact" className="absolute bottom-8 left-1/2 transform -translate-x-1/2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2 }}>
        <motion.div className="text-gray-400 text-sm mb-2" animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <Icon icon="material-symbols:keyboard-arrow-down" className="text-2xl" />
        </motion.div>
        <p className="text-gray-500 text-sm">Scroll to explore</p>
      </motion.a>
    </section>
  );
}
