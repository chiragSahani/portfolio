'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Suspense, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Icon } from '@iconify/react';
import * as THREE from 'three';

/* ===========================
   Animated Background Plane
   =========================== */
function ContactBackground() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const t = state.clock.elapsedTime;
      meshRef.current.rotation.z = Math.sin(t * 0.4) * 0.12;
      (meshRef.current.material as THREE.MeshStandardMaterial).opacity =
        0.12 + Math.sin(t) * 0.05;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -2]}>
      <planeGeometry args={[12, 9]} />
      <meshStandardMaterial
        color="#3b82f6"
        transparent
        opacity={0.1}
        wireframe
      />
    </mesh>
  );
}

/* ===========================
   Floating Cubes (message icons)
   =========================== */
function FloatingMessageIcons() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = t * 0.08;
    }
  });

  const positions = [
    [2, 1, 0],
    [-2, -1, 1],
    [1.5, -2, -1],
    [-1.5, 2, 0.5],
  ];

  return (
    <group ref={groupRef}>
      {positions.map((pos, index) => (
        <mesh
          key={index}
          position={pos as [number, number, number]}
          scale={1 + index * 0.1}
        >
          <boxGeometry args={[0.35, 0.35, 0.35]} />
          <meshStandardMaterial
            color="#06b6d4"
            transparent
            opacity={0.8}
            emissive="#0891b2"
            emissiveIntensity={0.4}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ===========================
   Contact Section
   =========================== */
export default function ContactSection() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSuccess(true);
    setFormData({ name: '', email: '', message: '' });
    setIsSubmitting(false);

    setTimeout(() => setSuccess(false), 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden bg-black"
    >
      {/* Background Canvas */}
      <div className="absolute inset-0 opacity-30">
        <Canvas camera={{ position: [0, 0, 5] }} dpr={[1, 1.5]}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.6} />
            <directionalLight position={[5, 5, 5]} intensity={0.7} />
            <pointLight position={[-5, -5, -5]} intensity={0.3} color="#3b82f6" />
            <ContactBackground />
            <FloatingMessageIcons />
          </Suspense>
        </Canvas>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-light text-white mb-6">
            Let&apos;s
            <span className="block bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Connect
            </span>
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Ready to bring your ideas to life? Let&apos;s discuss your next
            project and create something amazing together.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-medium text-white mb-8">Get in Touch</h3>
            <div className="space-y-6">
              {[
                {
                  icon: 'material-symbols:mail-outline',
                  title: 'Email',
                  value: 'chiragsahaan@gmail.com',
                  href: 'mailto:chiragsahaan@gmail.com',
                },
                {
                  icon: 'material-symbols:phone-outline',
                  title: 'Phone',
                  value: '+91 9528299664',
                  href: 'tel:+919528299664',
                },
                {
                  icon: 'material-symbols:location-on-outline',
                  title: 'Location',
                  value: 'Haldwani, India',
                  href: 'https://www.google.com/maps/place/Haldwani,+Uttarakhand,+India',
                },
              ].map((c, i) => (
                <motion.a
                  key={c.title}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl hover:bg-white/10 transition-all group"
                  whileHover={{ x: 10 }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <Icon icon={c.icon} className="text-white text-xl" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{c.title}</h4>
                    <p className="text-gray-300">{c.value}</p>
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Social Links */}
            <motion.div
              className="mt-8"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <h4 className="text-white font-medium mb-4">Follow Me</h4>
              <div className="flex gap-4">
                {[
                  {
                    icon: 'mdi:github',
                    href: 'https://github.com/chiragSahani',
                    label: 'GitHub',
                  },
                  {
                    icon: 'mdi:linkedin',
                    href: 'https://www.linkedin.com/in/chiragsahani/',
                    label: 'LinkedIn',
                  },
                  {
                    icon: 'mdi:email',
                    href: 'mailto:chiragsahaan@gmail.com',
                    label: 'Email',
                  },
                ].map((s, i) => (
                  <motion.a
                    key={s.icon}
                    href={s.href}
                    aria-label={s.label}
                    className="relative w-12 h-12 flex items-center justify-center rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition"
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                  >
                    <Icon icon={s.icon} className="text-xl" />
                    <span className="absolute inset-0 rounded-full border border-cyan-400/20 group-hover:border-cyan-400/40 transition" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-6 relative">
              <div>
                <label htmlFor="name" className="block text-white font-medium mb-2">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  aria-label="Your Name"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                  placeholder="Your Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-white font-medium mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  aria-label="Your Email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition"
                  placeholder="you@email.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-white font-medium mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  aria-label="Your Message"
                  className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:bg-white/10 transition resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 transition shadow-lg hover:shadow-blue-500/25 disabled:opacity-50"
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon icon="eos-icons:loading" className="animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Send Message
                    <Icon icon="material-symbols:send" />
                  </span>
                )}
              </motion.button>

              {/* Success Toast */}
              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className="absolute -bottom-14 left-1/2 -translate-x-1/2 px-6 py-3 bg-green-600 text-white rounded-lg shadow-lg"
                  >
                    ✅ Message sent successfully!
                  </motion.div>
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
