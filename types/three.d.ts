import * as THREE from 'three';
import { Object3DNode, MaterialNode } from '@react-three/fiber';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Three.js objects
      group: Object3DNode<THREE.Group, typeof THREE.Group>;
      mesh: Object3DNode<THREE.Mesh, typeof THREE.Mesh>;
      points: Object3DNode<THREE.Points, typeof THREE.Points>;
      
      // Geometries
      boxGeometry: Object3DNode<THREE.BoxGeometry, typeof THREE.BoxGeometry>;
      sphereGeometry: Object3DNode<THREE.SphereGeometry, typeof THREE.SphereGeometry>;
      planeGeometry: Object3DNode<THREE.PlaneGeometry, typeof THREE.PlaneGeometry>;
      octahedronGeometry: Object3DNode<THREE.OctahedronGeometry, typeof THREE.OctahedronGeometry>;
      tetrahedronGeometry: Object3DNode<THREE.TetrahedronGeometry, typeof THREE.TetrahedronGeometry>;
      icosahedronGeometry: Object3DNode<THREE.IcosahedronGeometry, typeof THREE.IcosahedronGeometry>;
      bufferGeometry: Object3DNode<THREE.BufferGeometry, typeof THREE.BufferGeometry>;
      
      // Materials
      meshStandardMaterial: MaterialNode<THREE.MeshStandardMaterial, typeof THREE.MeshStandardMaterial>;
      meshBasicMaterial: MaterialNode<THREE.MeshBasicMaterial, typeof THREE.MeshBasicMaterial>;
      pointsMaterial: MaterialNode<THREE.PointsMaterial, typeof THREE.PointsMaterial>;
      
      // Lights
      ambientLight: Object3DNode<THREE.AmbientLight, typeof THREE.AmbientLight>;
      directionalLight: Object3DNode<THREE.DirectionalLight, typeof THREE.DirectionalLight>;
      pointLight: Object3DNode<THREE.PointLight, typeof THREE.PointLight>;
      
      // Other
      color: Object3DNode<THREE.Color, typeof THREE.Color>;
    }
  }
}