import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NOISE_SOURCES } from './noiseData.js';

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
  uniform vec4 uNoiseSources[16]; // (x, z, intensity, radius)
  uniform int uNumSources;
  uniform float uTime;
  uniform float uOpacity;

  varying vec2 vUv;
  varying vec3 vWorldPosition;

  void main() {
    float maxAccumNoise = 0.0;
    float ringIntensityAcc = 0.0;
    vec2 pos = vWorldPosition.xz;

    for (int i = 0; i < 16; i++) {
      if (i >= uNumSources) break;
      vec4 source = uNoiseSources[i];
      vec2 sPos = source.xy;
      float intensity = source.z;
      float radius = source.w;

      float d = distance(pos, sPos);
      if (d < radius) {
        float normDist = d / radius;
        float atten = (1.0 - normDist) * intensity;

        // Concentric acoustic wave propagation rings
        float ring = sin(d * 1.6 - uTime * 2.5);
        ring = smoothstep(0.3, 0.95, ring); // Concentric wave crests

        maxAccumNoise = max(maxAccumNoise, atten);
        ringIntensityAcc += ring * atten * 0.45;
      }
    }

    maxAccumNoise = clamp(maxAccumNoise, 0.0, 1.0);
    ringIntensityAcc = clamp(ringIntensityAcc, 0.0, 1.0);

    // Acoustic Color Palette: Soft Cyan (Quiet) -> Indigo (Moderate) -> Magenta/Purple (Loud)
    vec3 quietColor = vec3(0.02, 0.72, 0.82); // Cyan
    vec3 midColor   = vec3(0.38, 0.40, 0.95); // Indigo
    vec3 loudColor  = vec3(0.72, 0.25, 0.92); // Magenta/Purple

    vec3 baseNoiseColor;
    if (maxAccumNoise < 0.4) {
      baseNoiseColor = mix(quietColor, midColor, maxAccumNoise / 0.4);
    } else {
      baseNoiseColor = mix(midColor, loudColor, (maxAccumNoise - 0.4) / 0.6);
    }

    // Blend acoustic wave crests over base field
    vec3 finalColor = mix(baseNoiseColor, vec3(0.9, 0.7, 1.0), ringIntensityAcc * 0.6);

    // Alpha mask: transparent outside noise zones, distinct ring highlights
    float alpha = (smoothstep(0.02, 0.25, maxAccumNoise) * 0.3 + ringIntensityAcc * 0.35) * uOpacity;

    gl_FragColor = vec4(finalColor, alpha);
  }
`;

/**
 * NoiseLayer
 * Spatial acoustic wave propagation visualization rendered via GLSL fragment shader
 * featuring concentric acoustic ring wave crests.
 */
export default function NoiseLayer({ visible = true }) {
  const currentOpacity = useRef(0);

  const material = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 16; i++) {
      if (i < NOISE_SOURCES.length) {
        const src = NOISE_SOURCES[i];
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
        uNoiseSources: { value: arr },
        uNumSources: { value: Math.min(NOISE_SOURCES.length, 16) },
        uTime: { value: 0.0 },
        uOpacity: { value: 0.0 },
      },
    });
  }, []);

  useFrame((state, delta) => {
    if (!material) return;
    const targetOpacity = visible ? 1.0 : 0.0;
    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, targetOpacity, delta * 6.0);
    material.uniforms.uOpacity.value = currentOpacity.current;
    material.uniforms.uTime.value = state.clock.getElapsedTime();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
      <planeGeometry args={[80, 80]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
