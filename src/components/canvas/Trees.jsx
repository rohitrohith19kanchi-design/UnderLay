import React from 'react';

/**
 * SingleStylizedTree
 * Helper component for a low-poly stylized tree structure.
 */
function SingleStylizedTree({ position, scale = 1, color = '#0d9488' }) {
  return (
    <group position={position} scale={scale}>
      {/* Tree Trunk */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.15, 0.25, 2, 8]} />
        <meshStandardMaterial color="#334155" roughness={0.9} />
      </mesh>

      {/* Stylized Foliage - Lower Cluster */}
      <mesh position={[0, 2.3, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.2, 0]} />
        <meshStandardMaterial color={color} roughness={0.7} metalness={0.1} />
      </mesh>

      {/* Stylized Foliage - Upper Cone Cap */}
      <mesh position={[0, 3.3, 0]} castShadow receiveShadow>
        <coneGeometry args={[0.9, 1.5, 6]} />
        <meshStandardMaterial color={color} roughness={0.6} metalness={0.1} />
      </mesh>
    </group>
  );
}

/**
 * Trees
 * Places a curated collection of stylized trees around the central plaza and walkways.
 */
export default function Trees() {
  const treeData = [
    { position: [-5, 0, -5], scale: 1.1, color: '#0f766e' },
    { position: [-6.5, 0, -3], scale: 0.95, color: '#0d9488' },
    { position: [5, 0, -5], scale: 1.0, color: '#047857' },
    { position: [6.5, 0, -2.5], scale: 1.2, color: '#0f766e' },
    { position: [-4, 0, 5], scale: 1.05, color: '#0d9488' },
    { position: [4, 0, 5.5], scale: 0.9, color: '#047857' },
    { position: [5.5, 0, 3.5], scale: 1.15, color: '#0f766e' },
    { position: [-15, 0, 8], scale: 1.3, color: '#065f46' },
    { position: [-12, 0, 11], scale: 1.1, color: '#047857' },
    { position: [16, 0, -4], scale: 1.25, color: '#0f766e' },
    { position: [6, 0, -15], scale: 1.0, color: '#0d9488' },
  ];

  return (
    <group>
      {treeData.map((tree, idx) => (
        <SingleStylizedTree
          key={`tree-${idx}`}
          position={tree.position}
          scale={tree.scale}
          color={tree.color}
        />
      ))}
    </group>
  );
}
