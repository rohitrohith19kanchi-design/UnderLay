import React from 'react';
import { Grid } from '@react-three/drei';

/**
 * GroundPlane
 * Renders the ground environment, central open plaza, and connecting pathways.
 */
export default function GroundPlane() {
  return (
    <group position={[0, 0, 0]}>
      {/* Main Base Terrain / Ground Surface */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.05, 0]}
        receiveShadow
      >
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial color="#0f172a" roughness={0.8} metalness={0.2} />
      </mesh>

      {/* Spatial Grid Overlay for scale and depth reference */}
      <Grid
        position={[0, 0, 0]}
        args={[80, 80]}
        cellSize={1}
        cellThickness={0.6}
        cellColor="#1e293b"
        sectionSize={5}
        sectionThickness={1.2}
        sectionColor="#334155"
        fadeDistance={55}
        fadeStrength={1}
      />

      {/* Central Open Area / Plaza */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        receiveShadow
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.3} />
      </mesh>

      {/* Plaza Inner Border Accent */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.015, 0]}
        receiveShadow
      >
        <ringGeometry args={[6.8, 7, 32]} />
        <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
      </mesh>

      {/* Connecting Path 1: Plaza to North-East Tower */}
      <mesh
        rotation={[-Math.PI / 2, 0, Math.PI / 4]}
        position={[7, 0.012, -7]}
        receiveShadow
      >
        <planeGeometry args={[3, 10]} />
        <meshStandardMaterial color="#273549" roughness={0.7} />
      </mesh>

      {/* Connecting Path 2: Plaza to West Innovation Hub */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[-9, 0.012, 0]}
        receiveShadow
      >
        <planeGeometry args={[10, 3.5]} />
        <meshStandardMaterial color="#273549" roughness={0.7} />
      </mesh>

      {/* Connecting Path 3: Plaza to South-East Pavilion */}
      <mesh
        rotation={[-Math.PI / 2, 0, -Math.PI / 6]}
        position={[7, 0.012, 7]}
        receiveShadow
      >
        <planeGeometry args={[3, 9]} />
        <meshStandardMaterial color="#273549" roughness={0.7} />
      </mesh>
    </group>
  );
}
