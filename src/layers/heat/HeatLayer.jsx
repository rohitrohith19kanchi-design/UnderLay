import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HEAT_SOURCES } from './heatData.js';

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
  uniform vec4 uHeatSources[16]; // (x, z, intensity, radius)
  uniform int uNumSources;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  // Smooth color gradient: Deep Cool Blue -> Teal -> Yellow -> Orange -> Crimson Red
  vec3 getHeatColor(float val) {
    vec3 c0 = vec3(0.06, 0.22, 0.55); // Deep Blue (Cool)
    vec3 c1 = vec3(0.0, 0.82, 0.88);  // Cyan / Cool Teal
    vec3 c2 = vec3(0.98, 0.84, 0.15); // Bright Yellow
    vec3 c3 = vec3(0.96, 0.45, 0.1);  // Warm Orange
    vec3 c4 = vec3(0.92, 0.12, 0.2);  // Hot Crimson Red

    if (val < 0.25) {
      return mix(c0, c1, val / 0.25);
    } else if (val < 0.5) {
      return mix(c1, c2, (val - 0.25) / 0.25);
    } else if (val < 0.75) {
      return mix(c2, c3, (val - 0.5) / 0.25);
    } else {
      return mix(c3, c4, (val - 0.75) / 0.25);
    }
  }

  void main() {
    float totalHeat = 0.0;
    vec2 pos = vWorldPosition.xz;

    for (int i = 0; i < 16; i++) {
      if (i >= uNumSources) break;
      vec4 source = uHeatSources[i];
      vec2 sPos = source.xy;
      float intensity = source.z;
      float radius = source.w;

      float d = distance(pos, sPos);
      if (d < radius) {
        float falloff = 1.0 - smoothstep(0.0, radius, d);
        // Smooth quadratic decay for realistic thermal distribution
        falloff = falloff * falloff;
        totalHeat += intensity * falloff;
      }
    }

    totalHeat = clamp(totalHeat, 0.0, 1.0);

    // Fade out edges where heat is low
    float alpha = smoothstep(0.02, 0.35, totalHeat) * uOpacity * 0.78;
    vec3 heatColor = getHeatColor(totalHeat);

    gl_FragColor = vec4(heatColor, alpha);
  }
`;

/**
 * HeatLayer
 * Performant 3D spatial heat field overlay rendered via custom fragment shader.
 */
export default function HeatLayer({ visible = true }) {
  const currentOpacity = useRef(0);

  const material = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 16; i++) {
      if (i < HEAT_SOURCES.length) {
        const src = HEAT_SOURCES[i];
        arr.push(new THREE.Vector4(src.position[0], src.position[1], src.intensity, src.radius));
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
        uHeatSources: { value: arr },
        uNumSources: { value: Math.min(HEAT_SOURCES.length, 16) },
        uOpacity: { value: 0.0 },
      },
    });
  }, []);

  useFrame((_, delta) => {
    if (!material) return;
    const targetOpacity = visible ? 1.0 : 0.0;
    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetOpacity, delta * 6.0);
    material.uniforms.uOpacity.value = currentOpacity.current;
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <planeGeometry args={[80, 80]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
