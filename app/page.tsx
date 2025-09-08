'use client';

import ThreeBackground from '@/app/components/ThreeBackground';
import HeroSection from '@/app/components/HeroSection';
import AboutSection from '@/app/components/AboutSection';
import ProjectsSection from '@/app/components/ProjectsSection';
import SkillsSection from '@/app/components/SkillsSection';
import ContactSection from '@/app/components/ContactSection';
import Footer from '@/app/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Global 3D Background */}
      <ThreeBackground />
      
      {/* Main Content */}
      <div className="relative z-10">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
        <Footer />
      </div>
    </div>
  );
}