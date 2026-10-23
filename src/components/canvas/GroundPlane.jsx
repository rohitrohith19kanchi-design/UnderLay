import React, { useMemo } from 'react';
import * as THREE from 'three';

function makeSurfaceTexture(kind) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  const isPaving = kind === 'paving';
  context.fillStyle = isPaving ? '#a8aaa2' : '#768878';
  context.fillRect(0, 0, 512, 512);

  // Deterministic fine variation breaks the flat CG surface without external assets.
  let seed = isPaving ? 1249 : 8893;
  const next = () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
  for (let i = 0; i < 9000; i += 1) {
    const shade = Math.floor(next() * 26) - 13;
    const alpha = 0.08 + next() * 0.16;
    context.fillStyle = isPaving
      ? `rgba(${150 + shade}, ${153 + shade}, ${146 + shade}, ${alpha})`
      : `rgba(${76 + shade}, ${106 + shade}, ${78 + shade}, ${alpha})`;
    const size = isPaving ? 1 + next() * 3 : 1 + next() * 2;
    context.fillRect(next() * 512, next() * 512, size, size);
  }
  if (isPaving) {
    context.strokeStyle = 'rgba(65, 73, 68, 0.28)';
    context.lineWidth = 2;
    for (let offset = 0; offset <= 512; offset += 64) {
      context.beginPath(); context.moveTo(offset, 0); context.lineTo(offset, 512); context.stroke();
      context.beginPath(); context.moveTo(0, offset); context.lineTo(512, offset); context.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(isPaving ? 1.2 : 18, isPaving ? 1.2 : 18);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  return texture;
}

export default function GroundPlane() {
  const grass = useMemo(() => makeSurfaceTexture('grass'), []);
  const paving = useMemo(() => makeSurfaceTexture('paving'), []);

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[80, 80]} />
        <meshStandardMaterial map={grass} color="#d6e1d2" roughness={1} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial map={paving} color="#e3e2d9" roughness={0.92} metalness={0} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.018, 0]} receiveShadow>
        <ringGeometry args={[6.8, 7, 64]} />
        <meshStandardMaterial color="#c3c6bd" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 4]} position={[7, 0.012, -7]} receiveShadow>
        <planeGeometry args={[3, 10]} />
        <meshStandardMaterial map={paving} color="#dadbd3" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[-9, 0.012, 0]} receiveShadow>
        <planeGeometry args={[10, 3.5]} />
        <meshStandardMaterial map={paving} color="#dadbd3" roughness={0.9} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, -Math.PI / 6]} position={[7, 0.012, 7]} receiveShadow>
        <planeGeometry args={[3, 9]} />
        <meshStandardMaterial map={paving} color="#dadbd3" roughness={0.9} />
      </mesh>
    </group>
  );
}
