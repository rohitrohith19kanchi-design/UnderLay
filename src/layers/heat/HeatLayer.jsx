import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_SCENARIO, SHADOW_BOXES, SHADOW_CANOPIES, getSolarPosition } from '../sunlight/sunlightData.js';
import { SURFACE_MATERIALS } from './heatData.js';

const vertexShader = `
  varying vec3 vWorldPosition;
  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const fragmentShader = `
  uniform vec3 uSunDirection;
  uniform float uClearSkyIrradiance;
  uniform float uGroundAlbedo;
  uniform float uPlazaAlbedo;
  uniform vec4 uBoxMin[8];
  uniform vec4 uBoxMax[8];
  uniform int uBoxCount;
  uniform vec4 uCanopies[16];
  uniform int uCanopyCount;
  uniform float uOpacity;
  varying vec3 vWorldPosition;

  bool rayHitsBox(vec3 origin, vec3 direction, vec3 boxMin, vec3 boxMax) {
    float nearHit = -1.0e20;
    float farHit = 1.0e20;
    for (int axis = 0; axis < 3; axis++) {
      float o = origin[axis];
      float d = direction[axis];
      if (abs(d) < 1.0e-6) {
        if (o < boxMin[axis] || o > boxMax[axis]) return false;
      } else {
        float a = (boxMin[axis] - o) / d;
        float b = (boxMax[axis] - o) / d;
        nearHit = max(nearHit, min(a, b));
        farHit = min(farHit, max(a, b));
      }
    }
    return farHit >= max(nearHit, 0.0);
  }

  bool rayHitsSphere(vec3 origin, vec3 direction, vec4 sphere) {
    vec3 offset = origin - sphere.xyz;
    float b = dot(offset, direction);
    float c = dot(offset, offset) - sphere.w * sphere.w;
    float discriminant = b * b - c;
    return discriminant >= 0.0 && -b + sqrt(discriminant) > 0.0;
  }

  void main() {
    vec3 origin = vec3(vWorldPosition.x, 0.04, vWorldPosition.z);
    bool shaded = uSunDirection.y <= 0.001;
    for (int i = 0; i < 8; i++) {
      if (i >= uBoxCount) break;
      if (rayHitsBox(origin, uSunDirection, uBoxMin[i].xyz, uBoxMax[i].xyz)) shaded = true;
    }
    for (int i = 0; i < 16; i++) {
      if (i >= uCanopyCount) break;
      if (rayHitsSphere(origin, uSunDirection, uCanopies[i])) shaded = true;
    }

    float albedo = max(abs(vWorldPosition.x), abs(vWorldPosition.z)) <= 7.0 ? uPlazaAlbedo : uGroundAlbedo;
    float absorbedLoad = uClearSkyIrradiance * (1.0 - albedo) * (shaded ? 0.15 : 1.0);
    float load = clamp(absorbedLoad / 700.0, 0.0, 1.0);
    vec3 low = vec3(0.08, 0.35, 0.68);
    vec3 mid = vec3(0.96, 0.72, 0.18);
    vec3 high = vec3(0.82, 0.16, 0.13);
    vec3 color = load < 0.55 ? mix(low, mid, load / 0.55) : mix(mid, high, (load - 0.55) / 0.45);
    float alpha = smoothstep(0.01, 0.15, load) * uOpacity * 0.62;
    gl_FragColor = vec4(color, alpha);
  }
`;

export default function HeatLayer({ visible = true, settings = {} }) {
  const currentOpacity = useRef(0);
  const inputs = useMemo(() => ({ ...DEFAULT_SCENARIO, ...settings }), [settings]);
  const solar = useMemo(() => getSolarPosition(inputs), [inputs]);
  const material = useMemo(() => {
    const boxMin = Array.from({ length: 8 }, (_, i) => new THREE.Vector4(...(SHADOW_BOXES[i] ? [...SHADOW_BOXES[i].min, 0] : [0, 0, 0, 0])));
    const boxMax = Array.from({ length: 8 }, (_, i) => new THREE.Vector4(...(SHADOW_BOXES[i] ? [...SHADOW_BOXES[i].max, 0] : [0, 0, 0, 0])));
    const canopies = Array.from({ length: 16 }, (_, i) => new THREE.Vector4(...(SHADOW_CANOPIES[i] || [0, 0, 0, 0])));
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uSunDirection: { value: new THREE.Vector3(...solar.direction) },
        uClearSkyIrradiance: { value: solar.clearSkyIrradiance },
        uGroundAlbedo: { value: Number(inputs.groundAlbedo ?? SURFACE_MATERIALS.ground.albedo) },
        uPlazaAlbedo: { value: Number(inputs.plazaAlbedo ?? SURFACE_MATERIALS.plaza.albedo) },
        uBoxMin: { value: boxMin },
        uBoxMax: { value: boxMax },
        uBoxCount: { value: SHADOW_BOXES.length },
        uCanopies: { value: canopies },
        uCanopyCount: { value: SHADOW_CANOPIES.length },
        uOpacity: { value: 0 },
      },
    });
  }, []);

  useFrame((_, delta) => {
    currentOpacity.current = THREE.MathUtils.lerp(currentOpacity.current, visible ? 1 : 0, delta * 6);
    material.uniforms.uOpacity.value = currentOpacity.current;
    material.uniforms.uSunDirection.value.set(...solar.direction);
    material.uniforms.uClearSkyIrradiance.value = solar.clearSkyIrradiance;
    material.uniforms.uGroundAlbedo.value = Number(inputs.groundAlbedo ?? SURFACE_MATERIALS.ground.albedo);
    material.uniforms.uPlazaAlbedo.value = Number(inputs.plazaAlbedo ?? SURFACE_MATERIALS.plaza.albedo);
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
      <planeGeometry args={[80, 80]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
