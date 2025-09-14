'use client';

import React, { Suspense, useRef, useMemo, useState, useEffect, useCallback } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Performance monitoring hook
function usePerformanceMonitor() {
  const [fps, setFps] = useState(60);
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());

  useFrame(() => {
    frameCount.current++;
    const now = performance.now();
    
    if (now - lastTime.current >= 1000) {
      setFps(Math.round((frameCount.current * 1000) / (now - lastTime.current)));
      frameCount.current = 0;
      lastTime.current = now;
    }
  });

  return fps;
}

// Optimized particles with instanced rendering
function OptimizedParticles({ count, visible }: { count: number; visible: boolean }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Pre-calculate positions and velocities
  const particleData = useMemo(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        position: new THREE.Vector3(
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20,
          (Math.random() - 0.5) * 20
        ),
        velocity: new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        )
      });
    }
    return data;
  }, [count]);

  useFrame((state) => {
    if (!meshRef.current || !visible) return;
    
    const time = state.clock.elapsedTime;
    
    for (let i = 0; i < count; i++) {
      const data = particleData[i];
      
      // Update position
      data.position.add(data.velocity);
      
      // Wrap around boundaries
      if (Math.abs(data.position.x) > 10) data.velocity.x *= -1;
      if (Math.abs(data.position.y) > 10) data.velocity.y *= -1;
      if (Math.abs(data.position.z) > 10) data.velocity.z *= -1;
      
      dummy.position.copy(data.position);
      dummy.rotation.set(time * 0.5, time * 0.3, 0);
      dummy.updateMatrix();
      
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <sphereGeometry args={[0.02, 8, 6]} />
      <meshBasicMaterial color="#00d4ff" transparent opacity={0.6} />
    </instancedMesh>
  );
}

// Simplified geometry with LOD
function OptimizedGeometry({ distance }: { distance: number }) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Choose geometry detail based on distance
  const geometryDetail = useMemo(() => {
    if (distance > 8) return { segments: 8, detail: 0.5 };
    if (distance > 5) return { segments: 16, detail: 0.7 };
    return { segments: 32, detail: 1.0 };
  }, [distance]);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[2, 1, 0]}>
        <boxGeometry args={[0.8 * geometryDetail.detail, 0.8 * geometryDetail.detail, 0.8 * geometryDetail.detail]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.7} />
      </mesh>
      
      <mesh position={[-2, -1, 1]}>
        <octahedronGeometry args={[0.6 * geometryDetail.detail, 0]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.7} />
      </mesh>
    </group>
  );
}

// Adaptive renderer component
function AdaptiveRenderer({ children }: { children: React.ReactNode }) {
  const { gl, camera } = useThree();
  const fps = usePerformanceMonitor();
  const [pixelRatio, setPixelRatio] = useState(1);
  
  useEffect(() => {
    // Cap pixel ratio for performance
    const ratio = Math.min(window.devicePixelRatio, 2);
    setPixelRatio(fps < 30 ? Math.min(ratio, 1) : ratio);
    gl.setPixelRatio(pixelRatio);
  }, [fps, gl, pixelRatio]);

  useEffect(() => {
    // Optimize renderer settings
    gl.outputColorSpace = THREE.SRGBColorSpace;
    gl.toneMapping = THREE.ACESFilmicToneMapping;
    gl.toneMappingExposure = 1;
    gl.shadowMap.enabled = false; // Disable shadows for performance
  }, [gl]);

  return <>{children}</>;
}

export default function OptimizedThreeBackground() {
  const [isVisible, setIsVisible] = useState(true);
  const [cameraDistance, setCameraDistance] = useState(5);
  
  // Responsive particle count
  const particleCount = useMemo(() => {
    if (typeof window === 'undefined') return 1000;
    const width = window.innerWidth;
    if (width < 640) return 500;  // Mobile
    if (width < 1024) return 1000; // Tablet
    return 2000; // Desktop
  }, []);

  // Visibility API for performance
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Intersection observer for camera distance
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setCameraDistance(entry.isIntersecting ? 5 : 8);
        });
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('home');
    if (element) observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <div className="absolute inset-0 bg-black" />
      
      {isVisible && (
        <Canvas
          camera={{ position: [0, 0, cameraDistance], fov: 60 }}
          dpr={[1, 2]} // Cap DPR
          gl={{
            antialias: false, // Disable for performance
            alpha: false,
            powerPreference: 'high-performance',
            preserveDrawingBuffer: false
          }}
          style={{ width: '100%', height: '100%' }}
          frameloop="demand" // Only render when needed
        >
          <AdaptiveRenderer>
            <color attach="background" args={['#000000']} />
            
            {/* Simplified lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 5, 5]} intensity={0.6} />
            
            <Suspense fallback={null}>
              <OptimizedParticles count={particleCount} visible={isVisible} />
              <OptimizedGeometry distance={cameraDistance} />
            </Suspense>
          </AdaptiveRenderer>
        </Canvas>
      )}
    </div>
  );
}