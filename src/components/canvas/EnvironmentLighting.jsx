import React from 'react';

/**
 * EnvironmentLighting
 * Configures base ambient lighting, fill lights, and atmospheric fog.
 * Automatically dims default key light when Sunlight spatial layer is active.
 */
export default function EnvironmentLighting({ sunlightActive = false }) {
  return (
    <>
      {/* Background color matching fog */}
      <color attach="background" args={['#0b0f19']} />

      {/* Atmospheric depth fog */}
      <fog attach="fog" args={['#0b0f19', 20, 80]} />

      {/* Soft ambient light for base visibility */}
      <ambientLight intensity={sunlightActive ? 0.25 : 0.4} color="#64748b" />

      {/* Default key directional light (Active ONLY when Sunlight layer is OFF) */}
      {!sunlightActive && (
        <directionalLight
          position={[25, 35, 15]}
          intensity={1.2}
          color="#f8fafc"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={100}
          shadow-camera-left={-30}
          shadow-camera-right={30}
          shadow-camera-top={30}
          shadow-camera-bottom={-30}
          shadow-bias={-0.0001}
        />
      )}

      {/* Secondary cyan fill/rim light for spatial depth */}
      <directionalLight
        position={[-20, 15, -20]}
        intensity={sunlightActive ? 0.2 : 0.4}
        color="#38bdf8"
      />

      {/* Soft ground bounce light */}
      <hemisphereLight
        skyColor="#1e293b"
        groundColor="#0f172a"
        intensity={sunlightActive ? 0.2 : 0.3}
      />
    </>
  );
}
