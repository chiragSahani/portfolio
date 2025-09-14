'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingScreenProps {
  onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  useEffect(() => {
    const stages = [
      { progress: 20, text: 'Loading assets...' },
      { progress: 40, text: 'Compiling shaders...' },
      { progress: 60, text: 'Optimizing geometry...' },
      { progress: 80, text: 'Preparing experience...' },
      { progress: 100, text: 'Ready!' }
    ];

    let currentStage = 0;
    const interval = setInterval(() => {
      if (currentStage < stages.length) {
        const stage = stages[currentStage];
        setProgress(stage.progress);
        setLoadingText(stage.text);
        currentStage++;
      } else {
        clearInterval(interval);
        setTimeout(onComplete, 500);
      }
    }, 300);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-black flex items-center justify-center"
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Binary rain background */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-green-400 text-xs font-mono"
              style={{ left: `${i * 5}%` }}
              animate={{
                y: ['0vh', '100vh'],
                opacity: [0, 1, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'linear'
              }}
            >
              {Array.from({ length: 20 }).map((_, j) => (
                <div key={j} className="mb-2">
                  {Math.random() > 0.5 ? '1' : '0'}
                </div>
              ))}
            </motion.div>
          ))}
        </div>

        <div className="relative z-10 text-center">
          {/* CPU Ring Animation */}
          <div className="relative w-32 h-32 mx-auto mb-8">
            <motion.div
              className="absolute inset-0 border-4 border-blue-500/30 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-2 border-2 border-cyan-400/50 rounded-full"
              animate={{ rotate: -360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-4 border border-green-400/70 rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            />
            
            {/* Center core */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-64 h-1 bg-gray-800 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>

          {/* Loading text */}
          <motion.p
            className="text-white text-lg font-mono"
            key={loadingText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {loadingText}
          </motion.p>

          {/* Progress percentage */}
          <motion.p
            className="text-cyan-400 text-sm font-mono mt-2"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            {progress}%
          </motion.p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}