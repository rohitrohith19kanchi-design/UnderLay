import React from 'react';

const concrete = { color: '#b9b9b0', roughness: 0.84, metalness: 0.02 };
const glass = { color: '#6f8d97', roughness: 0.24, metalness: 0.08 };

function FacadeWindow({ position, rotation = [0, 0, 0], size }) {
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshStandardMaterial {...glass} />
    </mesh>
  );
}

export default function Buildings() {
  return (
    <group>
      <group position={[12, 0, -12]}>
        <mesh position={[0, 7.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.5, 15, 4.5]} />
          <meshStandardMaterial {...concrete} />
        </mesh>
        {Array.from({ length: 8 }, (_, floor) => {
          const y = 1.25 + floor * 1.65;
          return (
            <React.Fragment key={`tower-floor-${floor}`}>
              <FacadeWindow position={[0, y, 2.27]} size={[3.55, 1.05]} />
              <FacadeWindow position={[2.27, y, 0]} rotation={[0, Math.PI / 2, 0]} size={[3.55, 1.05]} />
              <mesh position={[0, y + 0.68, 2.28]} castShadow>
                <boxGeometry args={[4.45, 0.09, 0.08]} />
                <meshStandardMaterial color="#8e918c" roughness={0.9} />
              </mesh>
            </React.Fragment>
          );
        })}
        <mesh position={[0, 15.5, 0]} castShadow>
          <boxGeometry args={[2.5, 1, 2.5]} />
          <meshStandardMaterial color="#777e79" roughness={0.82} />
        </mesh>
        <mesh position={[0, 1.25, 2.8]} castShadow receiveShadow>
          <boxGeometry args={[3.5, 0.3, 1.5]} />
          <meshStandardMaterial color="#777e79" roughness={0.82} />
        </mesh>
      </group>

      <group position={[-14, 0, 0]}>
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[9, 7, 6]} />
          <meshStandardMaterial {...concrete} />
        </mesh>
        {Array.from({ length: 3 }, (_, row) => Array.from({ length: 5 }, (_, column) => (
          <FacadeWindow key={`hub-window-${row}-${column}`} position={[-3.5 + column * 1.75, 1.5 + row * 1.8, 3.03]} size={[1.15, 0.95]} />
        )))}
        <mesh position={[-1, 8.5, 0.5]} castShadow receiveShadow>
          <boxGeometry args={[6, 3, 5]} />
          <meshStandardMaterial color="#d0d1c9" roughness={0.8} />
        </mesh>
        {Array.from({ length: 4 }, (_, column) => (
          <FacadeWindow key={`hub-upper-${column}`} position={[-3.2 + column * 1.45, 8.5, 3.02]} size={[1.0, 1.7]} />
        ))}
        <mesh position={[4.51, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4, 5]} />
          <meshStandardMaterial {...glass} />
        </mesh>
        {[1.5, -3.5].map((x) => (
          <mesh key={`hub-pillar-${x}`} position={[x, 7, 2.5]} castShadow>
            <cylinderGeometry args={[0.15, 0.18, 3, 12]} />
            <meshStandardMaterial color="#9a9d95" roughness={0.75} metalness={0.08} />
          </mesh>
        ))}
      </group>

      <group position={[11, 0, 10]}>
        <mesh position={[0, 2.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 4.5, 8]} />
          <meshStandardMaterial color="#b9b9af" roughness={0.84} metalness={0.02} />
        </mesh>
        <mesh position={[0, 4.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[9, 0.3, 9]} />
          <meshStandardMaterial color="#737b77" roughness={0.82} metalness={0.05} />
        </mesh>
        {[-2.3, 0, 2.3].map((z) => (
          <FacadeWindow key={`pavilion-window-${z}`} position={[-4.02, 2.1, z]} rotation={[0, -Math.PI / 2, 0]} size={[1.7, 2.8]} />
        ))}
        <mesh position={[0, 5, 0]} castShadow>
          <cylinderGeometry args={[2, 2.2, 0.4, 24]} />
          <meshStandardMaterial {...glass} />
        </mesh>
      </group>
    </group>
  );
}
