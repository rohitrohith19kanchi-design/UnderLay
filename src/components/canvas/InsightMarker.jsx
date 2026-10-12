import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

/**
 * InsightMarker
 * Lightweight glowing 3D target ring indicating the focal point of the selected Spatial Insight.
 */
export default function InsightMarker({ position, color = '#10b981' }) {
  const ringRef = useRef();

  useFrame((state) => {
    if (!ringRef.current) return;
    const t = state.clock.getElapsedTime();
    // Gentle pulse scale and rotation
    const scale = 1.0 + 0.15 * Math.sin(t * 3.0);
    ringRef.current.scale.set(scale, scale, 1);
    ringRef.current.rotation.z = t * 0.5;
  });

  if (!position) return null;

  return (
    <group position={[position[0], 0.06, position[2]]}>
      {/* Outer Pulse Ring */}
      <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.2, 2.5, 32]} />
        <meshBasicMaterial color={color} transparent opacity={0.65} />
      </mesh>

      {/* Inner Target Center Dot */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 16]} />
        <meshBasicMaterial color={color} transparent opacity={0.8} />
      </mesh>
    </group>
  );
}
