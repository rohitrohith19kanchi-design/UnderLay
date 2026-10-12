import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { SUNLIGHT_EXPOSURE_ZONES } from './sunlightData.js';

/**
 * Calculates sun trajectory position, color temperature, and light intensity from time of day (6.0 -> 18.0)
 */
export function getSunState(timeOfDay) {
  const t = Math.max(6, Math.min(18, timeOfDay));
  const normalized = (t - 6) / 12; // 0.0 -> 1.0 (Sunrise -> Sunset)
  const angle = normalized * Math.PI; // 0 -> PI

  // Solar Trajectory Arc: East (+35) -> Overhead (Y=40) -> West (-35)
  const x = 35 * Math.cos(angle);
  const y = 38 * Math.sin(angle) + 2.0;
  const z = 10 * Math.sin(angle); // Slight southern bias for dramatic architectural shadow angles

  // Sun Light Intensity Curve
  const intensity = 0.55 + 0.95 * Math.sin(angle);

  // Solar Color Warmth: Golden Horizon -> White Gold Zenith
  const sunColor = new THREE.Color();
  if (normalized < 0.5) {
    const factor = normalized * 2.0;
    sunColor.setHSL(0.08 + factor * 0.05, 0.9, 0.55 + factor * 0.35);
  } else {
    const factor = (normalized - 0.5) * 2.0;
    sunColor.setHSL(0.13 - factor * 0.07, 0.9, 0.9 - factor * 0.35);
  }

  return {
    position: [x, y, z],
    intensity,
    color: sunColor,
    angle,
    normalized,
  };
}

const vertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    vUv = uv;
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform vec4 uExposureZones[16]; // (x, z, maxExposure, radius)
  uniform int uNumZones;
  uniform float uSunAngle; // 0.0 -> PI
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    float solarAltitude = sin(uSunAngle); // 0 at horizon, 1 at zenith
    float totalExposure = 0.0;
    vec2 pos = vWorldPosition.xz;

    for (int i = 0; i < 16; i++) {
      if (i >= uNumZones) break;
      vec4 zone = uExposureZones[i];
      vec2 zPos = zone.xy;
      float maxExp = zone.z;
      float radius = zone.w;

      float d = distance(pos, zPos);
      if (d < radius) {
        float falloff = smoothstep(radius, 0.0, d);
        totalExposure += maxExp * falloff * (0.35 + 0.65 * solarAltitude);
      }
    }

    totalExposure = clamp(totalExposure, 0.0, 1.0);

    // Subtle warm golden solar highlight
    vec3 coolZoneColor = vec3(0.08, 0.16, 0.28); // Shadowed dark slate-blue
    vec3 warmSunColor  = vec3(0.96, 0.72, 0.22); // Solar gold highlight

    vec3 finalColor = mix(coolZoneColor, warmSunColor, totalExposure);

    // Subtle opacity (max ~0.35) so physical 3D shadows remain primary
    float alpha = smoothstep(0.05, 0.5, totalExposure) * uOpacity * 0.35;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

/**
 * SunlightLayer
 * Integrates dynamic solar directional lighting with realistic shadow casting
 * and a subtle ground solar exposure analysis shader overlay.
 */
export default function SunlightLayer({ visible = true, timeOfDay = 11.0 }) {
  const currentOpacity = useRef(0);
  const sunState = useMemo(() => getSunState(timeOfDay), [timeOfDay]);

  const material = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 16; i++) {
      if (i < SUNLIGHT_EXPOSURE_ZONES.length) {
        const zone = SUNLIGHT_EXPOSURE_ZONES[i];
        arr.push(new THREE.Vector4(zone.position[0], zone.position[1], zone.maxExposure, zone.radius));
      } else {
        arr.push(new THREE.Vector4(0, 0, 0, 0));
      }
    }

    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uExposureZones: { value: arr },
        uNumZones: { value: Math.min(SUNLIGHT_EXPOSURE_ZONES.length, 16) },
        uSunAngle: { value: Math.PI / 2 },
        uOpacity: { value: 0.0 },
      },
    });
  }, []);

  useFrame((_, delta) => {
    if (!material) return;
    const targetOpacity = visible ? 1.0 : 0.0;
    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetOpacity, delta * 6.0);
    material.uniforms.uOpacity.value = currentOpacity.current;
    material.uniforms.uSunAngle.value = sunState.angle;
  });

  return (
    <group>
      {/* Dynamic Directional Solar Light (Primary light source when Sunlight Layer is ACTIVE) */}
      {visible && (
        <directionalLight
          position={sunState.position}
          intensity={sunState.intensity}
          color={sunState.color}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-camera-near={0.5}
          shadow-camera-far={120}
          shadow-camera-left={-35}
          shadow-camera-right={35}
          shadow-camera-top={35}
          shadow-camera-bottom={-35}
          shadow-bias={-0.00015}
        />
      )}

      {/* Subtle Ground Solar Exposure Analysis Layer */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <planeGeometry args={[80, 80]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}
