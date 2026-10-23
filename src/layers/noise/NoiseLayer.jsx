import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { AMBIENT_NOISE_DBA, getNoiseSourcesForScenario } from './noiseData.js';

const vertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform vec4 uNoiseSources[16];
  uniform int uNumSources;
  uniform float uAmbientDba;
  uniform float uOpacity;
  varying vec3 vWorldPosition;

  void main() {
    float energy = pow(10.0, uAmbientDba / 10.0);
    vec2 position = vWorldPosition.xz;
    for (int i = 0; i < 16; i++) {
      if (i >= uNumSources) break;
      vec4 source = uNoiseSources[i];
      float distanceM = max(source.w, distance(position, source.xy));
      float levelDba = source.z - 20.0 * log(distanceM / source.w) / log(10.0);
      energy += pow(10.0, levelDba / 10.0);
    }
    float level = 10.0 * log(energy) / log(10.0);
    float t = clamp((level - 35.0) / 45.0, 0.0, 1.0);
    vec3 quiet = vec3(0.04, 0.65, 0.67);
    vec3 moderate = vec3(0.97, 0.72, 0.20);
    vec3 loud = vec3(0.82, 0.18, 0.22);
    vec3 color = t < 0.55 ? mix(quiet, moderate, t / 0.55) : mix(moderate, loud, (t - 0.55) / 0.45);
    float alpha = mix(0.12, 0.48, smoothstep(0.0, 1.0, t)) * uOpacity;
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function NoiseLayer({ visible = true, settings = {} }) {
  const currentOpacity = useRef(0);
  const inputs = useMemo(() => ({ ...settings }), [settings]);
  const sourcesForScenario = useMemo(() => getNoiseSourcesForScenario(inputs), [inputs]);
  const material = useMemo(() => {
    const sources = Array.from({ length: 16 }, (_, i) => {
      const source = sourcesForScenario[i];
      return new THREE.Vector4(source?.position[0] ?? 0, source?.position[1] ?? 0, source?.referenceLevelDba ?? 0, source?.referenceDistanceM ?? 0);
    });
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uNoiseSources: { value: sources },
        uNumSources: { value: sourcesForScenario.length },
        uAmbientDba: { value: Number(inputs.ambientNoiseDba ?? AMBIENT_NOISE_DBA) },
        uOpacity: { value: 0 },
      },
    });
  }, []);

  useFrame((_, delta) => {
    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, visible ? 1 : 0, delta * 6);
    material.uniforms.uOpacity.value = currentOpacity.current;
    material.uniforms.uAmbientDba.value = Number(inputs.ambientNoiseDba ?? AMBIENT_NOISE_DBA);
    sourcesForScenario.forEach((source, index) => {
      material.uniforms.uNoiseSources.value[index].set(source.position[0], source.position[1], source.referenceLevelDba, source.referenceDistanceM);
    });
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
      <planeGeometry args={[80, 80]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
