import * as THREE from 'three';

// Common material properties for consistency
export const createStandardMaterial = (
  color: string, 
  options: {
    transparent?: boolean;
    opacity?: number;
    emissive?: string;
    emissiveIntensity?: number;
    wireframe?: boolean;
  } = {}
) => {
  return new THREE.MeshStandardMaterial({
    color,
    transparent: options.transparent ?? true,
    opacity: options.opacity ?? 0.8,
    emissive: new THREE.Color(options.emissive ?? color),
    emissiveIntensity: options.emissiveIntensity ?? 0.2,
    wireframe: options.wireframe ?? false,
  });
};

// Generate particle positions for floating effects
export const generateParticlePositions = (count: number, spread: number = 4) => {
  const positions = new Float32Array(count * 3);
  
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 1] = (Math.random() - 0.5) * spread;
    positions[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  
  return positions;
};

// Common lighting setup for scenes
export const setupLighting = (scene: THREE.Scene) => {
  // Ambient light
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Main directional light
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(10, 10, 5);
  scene.add(directionalLight);

  // Blue point light
  const blueLight = new THREE.PointLight(0x3b82f6, 0.5);
  blueLight.position.set(-10, -10, -5);
  scene.add(blueLight);

  // Purple point light
  const purpleLight = new THREE.PointLight(0x8b5cf6, 0.3);
  purpleLight.position.set(10, -10, 5);
  scene.add(purpleLight);

  return { ambientLight, directionalLight, blueLight, purpleLight };
};

// Animation helpers
export const createFloatingAnimation = (
  mesh: THREE.Mesh, 
  time: number, 
  index: number = 0,
  amplitude: number = 0.1
) => {
  if (mesh) {
    mesh.rotation.x = Math.sin(time + index) * amplitude;
    mesh.rotation.y = Math.cos(time * 0.8 + index) * amplitude;
    mesh.position.y = Math.sin(time * 1.5 + index) * amplitude;
  }
};

export const createOrbitAnimation = (
  group: THREE.Group,
  time: number,
  speed: number = 0.1
) => {
  if (group) {
    group.rotation.y = time * speed;
  }
};