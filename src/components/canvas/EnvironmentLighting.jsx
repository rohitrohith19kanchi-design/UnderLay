import React, { useMemo } from 'react';
import * as THREE from 'three';

/** Ambient sky and base sun light track the same scenario inputs as the analysis layers. */
export default function EnvironmentLighting({ sunlightActive = false, solarPosition }) {
  const solarDirection = useMemo(() => new THREE.Vector3(...(solarPosition?.direction ?? [0, 1, 0])), [solarPosition]);
  const lightPosition = solarDirection.clone().multiplyScalar(45);
  const daylight = THREE.MathUtils.clamp(((solarPosition?.elevation ?? 45) + 5) / 25, 0, 1);
  const skyColor = new THREE.Color('#111a24').lerp(new THREE.Color('#a9c8d5'), daylight);
  const ambientIntensity = 0.12 + daylight * 0.5;
  const directIntensity = Math.max(0, Math.sin(Math.max(0, (solarPosition?.elevation ?? 0) * Math.PI / 180)));

  return (
    <>
      <color attach="background" args={[skyColor]} />
      <fog attach="fog" args={[skyColor, 75, 155]} />
      <ambientLight intensity={ambientIntensity} color="#f4f2e8" />
      {!sunlightActive && directIntensity > 0 && (
        <directionalLight
          position={lightPosition.toArray()}
          intensity={1.35 * directIntensity}
          color="#fff1d7"
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={100}
          shadow-camera-left={-35}
          shadow-camera-right={35}
          shadow-camera-top={35}
          shadow-camera-bottom={-35}
          shadow-bias={-0.0001}
        />
      )}
      <directionalLight position={[-20, 15, 18]} intensity={0.12 + daylight * 0.2} color="#d5e5f2" />
      <hemisphereLight skyColor="#d8eaf3" groundColor="#667257" intensity={0.08 + daylight * 0.42} />
    </>
  );
}
