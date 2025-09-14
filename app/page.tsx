'use client';

import { useState, useEffect } from 'react';
import OptimizedThreeBackground from '@/app/components/OptimizedThreeBackground';
import LoadingScreen from '@/app/components/LoadingScreen';
import HeroSection from '@/app/components/HeroSection';
import {
  LazyAboutSection,
  LazyProjectsSection,
  LazySkillsSection,
  LazyContactSection,
  LazyFooter
} from '@/app/components/LazyComponents';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Preload critical resources
    const preloadCritical = async () => {
      // Preload hero section assets
      const heroImage = new Image();
      heroImage.src = 'https://res.cloudinary.com/dlyctssmy/image/upload/v1734845393/android-chrome-512x512_oh3h9a.png';
      
      // Wait for critical assets
      await new Promise(resolve => {
        heroImage.onload = resolve;
        heroImage.onerror = resolve; // Continue even if image fails
      });
    };

    preloadCritical();
  }, []);

  const handleLoadingComplete = () => {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 100);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      
      {!isLoading && (
        <>
          {/* Optimized 3D Background */}
          <OptimizedThreeBackground />
          
          {/* Main Content */}
          <div className="relative z-10">
            <HeroSection />
            {showContent && (
              <>
                <LazyAboutSection />
                <LazyProjectsSection />
                <LazySkillsSection />
                <LazyContactSection />
                <LazyFooter />
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
}