'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Lazy load heavy components
export const LazyAboutSection = dynamic(() => import('./AboutSection'), {
  loading: () => (
    <div className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-800 rounded mb-8 w-64"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div className="space-y-4">
              <div className="h-4 bg-gray-800 rounded w-full"></div>
              <div className="h-4 bg-gray-800 rounded w-3/4"></div>
              <div className="h-4 bg-gray-800 rounded w-5/6"></div>
            </div>
            <div className="h-80 bg-gray-800 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: false
});

export const LazyProjectsSection = dynamic(() => import('./ProjectsSection'), {
  loading: () => (
    <div className="py-32 bg-black/70">
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse">
          <div className="h-16 bg-gray-800 rounded mb-16 w-96 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-96 bg-gray-800 rounded-3xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: false
});

export const LazySkillsSection = dynamic(() => import('./SkillsSection'), {
  loading: () => (
    <div className="py-24 bg-black/60">
      <div className="max-w-6xl mx-auto px-6">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-800 rounded mb-12 w-64 mx-auto"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-800 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: false
});

export const LazyContactSection = dynamic(() => import('./ContactSection'), {
  loading: () => (
    <div className="py-24 bg-black">
      <div className="max-w-6xl mx-auto px-6">
        <div className="animate-pulse">
          <div className="h-12 bg-gray-800 rounded mb-16 w-64 mx-auto"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-16 bg-gray-800 rounded-xl"></div>
              ))}
            </div>
            <div className="space-y-6">
              <div className="h-12 bg-gray-800 rounded"></div>
              <div className="h-12 bg-gray-800 rounded"></div>
              <div className="h-32 bg-gray-800 rounded"></div>
              <div className="h-12 bg-gray-800 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: false
});

export const LazyFooter = dynamic(() => import('./Footer'), {
  loading: () => (
    <div className="bg-black/50 backdrop-blur-lg border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <div className="h-6 bg-gray-800 rounded w-32"></div>
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, j) => (
                    <div key={j} className="h-4 bg-gray-800 rounded w-24"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  ssr: false
});