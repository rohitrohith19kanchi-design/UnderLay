import React from 'react';
import { DEMO_TREES } from '../../simulation/siteGeometry.js';

function Tree({ position, scale = 1, color }) {
  return (
    <group position={position} scale={scale}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.28, 2, 10]} />
        <meshStandardMaterial color="#705742" roughness={0.95} />
      </mesh>
      <mesh position={[0, 2.6, 0]} castShadow receiveShadow>
        <sphereGeometry args={[1.2, 14, 12]} />
        <meshStandardMaterial color={color} roughness={0.96} metalness={0} />
      </mesh>
      <mesh position={[0.5, 3.15, -0.2]} scale={[0.75, 0.78, 0.8]} castShadow receiveShadow>
        <sphereGeometry args={[1, 12, 10]} />
        <meshStandardMaterial color={color} roughness={0.96} metalness={0} />
      </mesh>
    </group>
  );
}

export default function Trees() {
  return (
    <group>
      {DEMO_TREES.map((tree, index) => <Tree key={`tree-${index}`} {...tree} />)}
    </group>
  );
}
