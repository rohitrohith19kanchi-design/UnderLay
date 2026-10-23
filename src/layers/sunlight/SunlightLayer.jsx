import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { DEFAULT_SCENARIO, SHADOW_BOXES, SHADOW_CANOPIES, getSolarPosition } from './sunlightData.js';

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

    float irradiance = uClearSkyIrradiance * (shaded ? 0.15 : 1.0);
    float exposure = clamp(irradiance / 1000.0, 0.0, 1.0);
    vec3 shadeColor = vec3(0.12, 0.19, 0.27);
    vec3 sunColor = vec3(1.0, 0.72, 0.30);
    vec3 finalColor = mix(shadeColor, sunColor, exposure);
    float alpha = mix(0.12, 0.38, exposure) * uOpacity;
    if (uClearSkyIrradiance <= 1.0) alpha = 0.0;
    gl_FragColor = vec4(finalColor, alpha);
  }
`;

function getSolarLightState(settings) {
  const position = getSolarPosition(settings);
  const direction = new THREE.Vector3(...position.direction);
  const color = new THREE.Color().setHSL(0.10 + Math.min(position.elevation, 60) / 60 * 0.035, 0.72, 0.60);
  return { ...position, direction, lightPosition: direction.clone().multiplyScalar(45), color };
}

export default function SunlightLayer({ visible = true, settings = {} }) {
  const currentOpacity = useRef(0);
  const inputs = useMemo(() => ({ ...DEFAULT_SCENARIO, ...settings }), [settings]);
  const sunState = useMemo(() => getSolarLightState(inputs), [inputs]);

  const material = useMemo(() => {
    const boxMin = Array.from({ length: 8 }, (_, i) => {
      const box = SHADOW_BOXES[i];
      return new THREE.Vector4(...(box ? [...box.min, 0] : [0, 0, 0, 0]));
    });
    const boxMax = Array.from({ length: 8 }, (_, i) => {
      const box = SHADOW_BOXES[i];
      return new THREE.Vector4(...(box ? [...box.max, 0] : [0, 0, 0, 0]));
    });
    const canopies = Array.from({ length: 16 }, (_, i) => {
      const canopy = SHADOW_CANOPIES[i];
      return new THREE.Vector4(...(canopy || [0, 0, 0, 0]));
    });
    return new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uSunDirection: { value: sunState.direction },
        uClearSkyIrradiance: { value: sunState.clearSkyIrradiance },
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
    material.uniforms.uSunDirection.value.copy(sunState.direction);
    material.uniforms.uClearSkyIrradiance.value = sunState.clearSkyIrradiance;
  });

  return (
    <group>
      {visible && sunState.elevation > 0 && (
        <directionalLight
          position={sunState.lightPosition.toArray()}
          intensity={1.4 * Math.sin(sunState.elevation * Math.PI / 180)}
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
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.035, 0]}>
        <planeGeometry args={[80, 80]} />
        <primitive object={material} attach="material" />
      </mesh>
    </group>
  );
}
