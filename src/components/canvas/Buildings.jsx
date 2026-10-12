import React from 'react';

/**
 * Buildings
 * Renders 3 distinct architectural structures with realistic proportions and clean geometry:
 * 1. Tech Tower (Tall North-East tower)
 * 2. Innovation Hub (Mid-rise West L-shaped structure)
 * 3. Community Pavilion (Low-rise South-East structure)
 */
export default function Buildings() {
  return (
    <group>
      {/* ===================================================
          BUILDING 1: TECH TOWER (North-East)
          Dimensions: 4.5m x 4.5m x 15m height
          =================================================== */}
      <group position={[12, 0, -12]}>
        {/* Main Tower Structure */}
        <mesh position={[0, 7.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.5, 15, 4.5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.3} metalness={0.7} />
        </mesh>

        {/* Accent Glass Facade Panels */}
        <mesh position={[0, 7.5, 2.26]}>
          <planeGeometry args={[3.5, 13]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.35} />
        </mesh>
        <mesh position={[2.26, 7.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[3.5, 13]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.35} />
        </mesh>

        {/* Rooftop Mechanical / Antenna Cap */}
        <mesh position={[0, 15.5, 0]} castShadow>
          <boxGeometry args={[2.5, 1, 2.5]} />
          <meshStandardMaterial color="#334155" roughness={0.5} />
        </mesh>

        {/* Ground Floor Entrance Canopy */}
        <mesh position={[0, 1.25, 2.8]} castShadow receiveShadow>
          <boxGeometry args={[3.5, 0.3, 1.5]} />
          <meshStandardMaterial color="#0f172a" roughness={0.4} />
        </mesh>
      </group>

      {/* ===================================================
          BUILDING 2: INNOVATION HUB (West)
          Dimensions: Dual-volume mid-rise structure (9m x 6m x 7m)
          =================================================== */}
      <group position={[-14, 0, 0]}>
        {/* Primary Low Block */}
        <mesh position={[0, 3.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[9, 7, 6]} />
          <meshStandardMaterial color="#334155" roughness={0.4} metalness={0.5} />
        </mesh>

        {/* Secondary Upper Cantilevered Volume */}
        <mesh position={[-1, 8.5, 0.5]} castShadow receiveShadow>
          <boxGeometry args={[6, 3, 5]} />
          <meshStandardMaterial color="#1e293b" roughness={0.2} metalness={0.8} />
        </mesh>

        {/* Glass Atrium Entrance (Facing Plaza) */}
        <mesh position={[4.51, 2.5, 0]} rotation={[0, Math.PI / 2, 0]}>
          <planeGeometry args={[4, 5]} />
          <meshStandardMaterial color="#60a5fa" roughness={0.1} metalness={0.9} transparent opacity={0.4} />
        </mesh>

        {/* Structural Pillar Supports */}
        <mesh position={[1.5, 7, 2.5]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 3]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
        <mesh position={[-3.5, 7, 2.5]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 3]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} />
        </mesh>
      </group>

      {/* ===================================================
          BUILDING 3: COMMUNITY PAVILION (South-East)
          Dimensions: Low-rise campus building (8m x 8m x 4.5m)
          =================================================== */}
      <group position={[11, 0, 10]}>
        {/* Main Base Body */}
        <mesh position={[0, 2.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[8, 4.5, 8]} />
          <meshStandardMaterial color="#475569" roughness={0.5} metalness={0.4} />
        </mesh>

        {/* Overhanging Roof Canopy */}
        <mesh position={[0, 4.65, 0]} castShadow receiveShadow>
          <boxGeometry args={[9, 0.3, 9]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.6} />
        </mesh>

        {/* Central Skylight/Atrium Dome */}
        <mesh position={[0, 5, 0]} castShadow>
          <cylinderGeometry args={[2, 2.2, 0.4, 16]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.1} metalness={0.9} transparent opacity={0.5} />
        </mesh>

        {/* Entrance Portal Facing Plaza */}
        <mesh position={[-4.01, 1.8, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <planeGeometry args={[3, 3.2]} />
          <meshStandardMaterial color="#0284c7" roughness={0.2} metalness={0.8} transparent opacity={0.35} />
        </mesh>
      </group>
    </group>
  );
}
