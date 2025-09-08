"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";
import * as THREE from "three";

// Enhanced 3D Project Card Background
function ProjectCard3D({ index }: { index: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime + index) * 0.15;
      meshRef.current.rotation.y =
        Math.cos(state.clock.elapsedTime * 0.8 + index) * 0.15;
      meshRef.current.position.z = -1 + Math.sin(state.clock.elapsedTime * 0.5 + index) * 0.3;
    }
    
    if (particlesRef.current) {
      particlesRef.current.rotation.z = state.clock.elapsedTime * 0.1;
    }
  });

  const particlePositions = new Float32Array(200 * 3);
  for (let i = 0; i < 200; i++) {
    particlePositions[i * 3] = (Math.random() - 0.5) * 4;
    particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3;
    particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 2;
  }

  return (
    <>
      <mesh ref={meshRef} position={[0, 0, -1]}>
        <planeGeometry args={[4, 2.8]} />
        <meshStandardMaterial
          color="#3b82f6"
          transparent
          opacity={0.4}
          wireframe
        />
      </mesh>
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={particlePositions}
            count={200}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial color="#60a5fa" size={0.02} transparent opacity={0.6} />
      </points>
    </>
  );
}

interface Project {
  title: string;
  description: string;
  image: string;
  techStack: string[];
  githubUrl: string;
  demoUrl: string;
  featured?: boolean;
}

export default function ProjectsSection() {
  const projects: Project[] = [
    {
      title: "Chat Room",
      description:
        "Engineered real-time chat application leveraging WebSocket connections for instant messaging, implemented comprehensive presence tracking system, and architected push notification infrastructure for seamless user engagement across multiple platforms.",
      techStack: [
        "React",
        "TypeScript", 
        "Supabase",
        "PostgreSQL",
        "Zustand",
        "Tailwind CSS",
      ],
      demoUrl: "https://chiragchat.netlify.app/",
      githubUrl: "https://github.com/chiragSahani/chatRoom.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1742303199/8477495_3917249_grvyhi.jpg",
    },
    {
      title: "CryptoWeather Nexus",
      description:
        "Developed comprehensive real-time dashboard integrating cryptocurrency APIs and weather services, optimized Redux state management for complex data flows, and implemented WebSocket connections for live market updates with advanced charting capabilities.",
      techStack: [
        "Next.js",
        "TypeScript",
        "Redux Toolkit", 
        "WebSockets",
        "Tailwind CSS",
      ],
      demoUrl: "https://chiragnexus.netlify.app/",
      githubUrl: "https://github.com/chiragSahani/Nexus.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1743684513/cr1_wlvyul.svg",
    },
    {
      title: "Stroke Prediction AI",
      description: "Architected machine learning model utilizing TensorFlow for stroke risk prediction, processed complex healthcare datasets with Pandas, and deployed scalable algorithms achieving 89% accuracy in clinical risk assessment.",
      techStack: ["Python", "TensorFlow", "Scikit-learn", "Pandas"],
      demoUrl: "https://github.com/chiragSahani/Heart_disease.git",
      githubUrl: "https://github.com/chiragSahani/Heart_disease.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1734772905/ai-technology-brain-background-digital-transformation-concept_hpnzul.jpg",
    },
    {
      title: "NestTravels", 
      description: "Engineered responsive tourism platform with advanced trip planning algorithms, integrated interactive maps with geolocation services, and implemented dynamic content management system for seamless booking experience.",
      techStack: ["HTML", "CSS", "JavaScript", "Bootstrap"],
      demoUrl: "https://nesttravels.ccbp.tech/",
      githubUrl: "https://github.com/chiragSahani/Gogaga-Holidays.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1710677931/g-2_yrlp9t.jpg",
    },
    {
      title: "AI Voicebot",
      description: "Developed conversational AI system utilizing advanced NLP algorithms, integrated TensorFlow neural networks for natural language understanding, and implemented WebRTC for real-time voice communication.",
      techStack: ["Python", "TensorFlow", "NLP", "WebRTC"],
      demoUrl: "https://github.com/chiragSahani/AI_Voice_Alexa.git",
      githubUrl: "https://github.com/chiragSahani/AI_Voice_Alexa.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1743665464/aibot_k2jjkk.jpg",
    },
    {
      title: "Nxt Trendz",
      description:
        "Built comprehensive e-commerce platform with JWT authentication, implemented secure payment gateway integration, and optimized shopping cart functionality for enhanced user conversion rates.",
      techStack: ["React", "JWT Authentication", "E-commerce"],
      demoUrl: "https://chiragtech.ccbp.tech/",
      githubUrl: "https://github.com/chiragSahani/ecommQuadB.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1734764669/Screenshot_202_ocrd70.png",
    },
    {
      title: "Portfolio Website",
      description:
        "Crafted modern portfolio website showcasing advanced React patterns, implemented Three.js 3D graphics for immersive user experience, and optimized TypeScript architecture for maintainable codebase.",
      techStack: ["React", "TypeScript", "Tailwind CSS"],
      demoUrl: "https://chiragsahni093.netlify.app/",
      githubUrl: "https://github.com/chiragSahani/MyPortfolio.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1736608522/Screenshot_5_zrxsdb.png",
    },
    {
      title: "Expense Tracker",
      description:
        "Constructed web-based finance management tool with real-time calculations, implemented dynamic expense categorization system, and architected local storage integration for persistent data management.",
      techStack: ["HTML", "CSS", "JavaScript"],
      demoUrl: "https://expensechirag.ccbp.tech/",
      githubUrl: "https://github.com/chiragSahani/ExpenseTracker.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1736660767/Screenshot_6_fsipxm.png",
    },
    {
      title: "Screen Recorder",
      description: "Developed web-based screen recording application with advanced filter systems, implemented real-time video processing capabilities, and architected seamless download functionality for enhanced user productivity.",
      techStack: ["React", "Tailwind", "TypeScript"],
      demoUrl: "https://chirag9528.netlify.app/",
      githubUrl: "https://github.com/chiragSahani/ScreenRecorder.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1743684670/screen_xx45sc.jpg",
    },
    {
      title: "MedBook",
      description:
        "Built digital healthcare management platform with secure patient record storage, implemented JWT authentication for data protection, and architected scalable MongoDB database design for medical information systems.",
      techStack: ["React", "Node.js", "MongoDB", "JWT", "Tailwind"],
      demoUrl: "https://medbookchirag.netlify.app/",
      githubUrl: "https://github.com/chiragSahani/medbook.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1741625242/Screenshot_252_oa2il7.png",
    },
    {
      title: "CareConnect",
      description:
        "Engineered next-generation healthcare platform integrating Gemini AI for intelligent patient diagnostics, developed comprehensive Redux state management system, and implemented advanced TypeScript architecture for scalable medical applications.",
      techStack: ["Gemini", "React", "Redux", "TypeScript", "Tailwind CSS"],
      demoUrl: "https://care-connect-niroggyan.netlify.app/",
      githubUrl: "https://github.com/chiragSahani/CareConnect.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1757259988/Shutterstock_Buravleva_stock-scaled_zxoaio.avif",
    },
    {
      title: "Resume Formatter",
      description:
        "Developed powerful AI-driven resume formatting application leveraging Gemini API for intelligent document processing, implemented multi-format export capabilities (PDF, DOCX, TXT), and architected robust file processing pipeline with Multer integration.",
      techStack: [
        "Next.js",
        "Node.js",
        "Gemini API",
        "Multer",
        "PDF Processing",
      ],
      demoUrl: "https://github.com/chiragSahani/resume-formatter.git",
      githubUrl: "https://github.com/chiragSahani/resume-formatter.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1757259987/images_tj6do9.jpg",
    },
    {
      title: "Jobby App",
      description:
        "Constructed comprehensive job search platform with advanced filtering algorithms, implemented secure authentication system, and developed dynamic search functionality with salary range optimization for enhanced recruitment experience.",
      techStack: [
        "React",
        "JavaScript",
        "CSS",
        "API Integration",
        "Authentication",
      ],
      demoUrl: "https://csahanijobby.ccbp.tech/login",
      githubUrl: "https://github.com/chiragSahani/JobbyApp.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1757259987/jobby-app-home-lg-output_ydsjkf.png",
    },
    {
      title: "Nxt Watch",
      description:
        "Built modern video streaming platform inspired by YouTube architecture, implemented Context API for efficient state management, and developed seamless navigation system with personalized recommendation algorithms for enhanced viewing experience.",
      techStack: [
        "React",
        "Context API",
        "JavaScript",
        "CSS",
        "Video Streaming",
      ],
      demoUrl: "https://csahaninxt.ccbp.tech/login",
      githubUrl: "https://github.com/chiragSahani/NxtWatch.git",
      image:
        "https://res.cloudinary.com/dlyctssmy/image/upload/v1757259988/nxt-watch-home-success-dark-theme-lg-output_a86git.png",
    },
  ];

  return (
    <section
      id="projects"
      className="py-32 relative overflow-hidden bg-black/70 backdrop-blur-sm"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-blue-500/5 to-black/20" />
        <div className="absolute inset-0 bg-gradient-radial from-blue-500/10 via-transparent to-transparent" />
      </div>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24 relative z-10">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <motion.h2
            className="text-6xl md:text-7xl lg:text-8xl font-light text-white mb-8 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Featured
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
              Projects
            </span>
          </motion.h2>

          <motion.p
            className="text-xl md:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Showcasing innovative solutions and creative implementations using
            cutting-edge technologies, modern architecture patterns, and industry-leading best practices.
          </motion.p>
        </motion.div>
      </div>

      {/* Enhanced Projects Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              className="group relative"
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -20 }}
            >
              {/* Enhanced 3D Background */}
              <div className="absolute inset-0 opacity-70">
                <Canvas camera={{ position: [0, 0, 3.5] }}>
                  <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[3, 3, 3]} intensity={0.8} color="#3b82f6" />
                    <pointLight position={[-3, -3, -3]} intensity={0.4} color="#8b5cf6" />
                    <ProjectCard3D index={index} />
                  </Suspense>
                </Canvas>
              </div>

              {/* Enhanced Project Card */}
              <div className="relative z-10 bg-black/50 backdrop-blur-xl border border-white/20 rounded-3xl overflow-hidden shadow-2xl hover:shadow-4xl transition-all duration-700 hover:bg-black/70 hover:border-cyan-500/40">
                
                {/* Enhanced Project Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  
                  {/* Enhanced Overlay Actions */}
                  <div className="absolute top-6 right-6 flex gap-4 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-4 group-hover:translate-y-0">
                    <motion.a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-gradient-to-r from-cyan-600 to-blue-700 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:from-cyan-700 hover:to-blue-800 transition-all duration-300 shadow-xl hover:shadow-cyan-500/30"
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon icon="material-symbols:rocket-launch" className="text-xl" />
                    </motion.a>
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 bg-gradient-to-r from-gray-800 to-gray-900 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-xl hover:shadow-gray-500/30"
                      whileHover={{ scale: 1.15, rotate: -10 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Icon icon="mdi:github" className="text-xl" />
                    </motion.a>
                  </div>
                </div>

                {/* Enhanced Project Content */}
                <div className="p-8 lg:p-10">
                  <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6 group-hover:text-cyan-400 transition-colors duration-300">
                    {project.title}
                  </h3>
                  
                  <p className="text-gray-300 text-lg leading-relaxed mb-8 line-clamp-4">
                    {project.description}
                  </p>

                  {/* Enhanced Tech Stack */}
                  <div className="flex flex-wrap gap-3 mb-8">
                    {project.techStack.map((tech, techIndex) => (
                      <motion.span
                        key={tech}
                        className="px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-cyan-300 text-sm font-medium rounded-full border border-cyan-500/30 backdrop-blur-sm hover:border-cyan-400/50 transition-all duration-300"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        whileInView={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: techIndex * 0.1 + 0.5 }}
                        whileHover={{ scale: 1.05, y: -3 }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex gap-4">
                    <motion.a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-4 px-8 bg-gradient-to-r from-cyan-600 to-blue-600 text-white text-center text-lg font-semibold rounded-2xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
                      whileHover={{ scale: 1.03, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="flex items-center justify-center gap-3">
                        <Icon icon="material-symbols:play-arrow" className="text-xl" />
                        Live Demo
                      </span>
                    </motion.a>
                    <motion.a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-4 px-8 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center text-lg font-semibold rounded-2xl hover:from-gray-700 hover:to-gray-800 transition-all duration-300 shadow-lg hover:shadow-gray-500/25"
                      whileHover={{ scale: 1.03, y: -3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="flex items-center justify-center gap-3">
                        <Icon icon="mdi:github" className="text-xl" />
                        Source Code
                      </span>
                    </motion.a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

       
       
      </div>

      {/* Enhanced Scroll Indicator */}
      <motion.a
        href="#skills"
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        <motion.div
          className="text-gray-400 text-center"
          animate={{ y: [0, 15, 0] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <Icon
            icon="material-symbols:keyboard-double-arrow-down"
            className="text-3xl mb-2"
          />
          <p className="text-gray-500 text-sm font-medium">Next Section</p>
        </motion.div>
      </motion.a>
    </section>
  );
}