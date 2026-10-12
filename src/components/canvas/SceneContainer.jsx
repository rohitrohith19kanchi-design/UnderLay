import React, { Suspense, useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import EnvironmentLighting from './EnvironmentLighting.jsx';
import GroundPlane from './GroundPlane.jsx';
import Buildings from './Buildings.jsx';
import Trees from './Trees.jsx';
import HeatLayer from '../../layers/heat/HeatLayer.jsx';
import SunlightLayer from '../../layers/sunlight/SunlightLayer.jsx';
import NoiseLayer from '../../layers/noise/NoiseLayer.jsx';
import InsightMarker from './InsightMarker.jsx';

/**
 * CameraFocusHandler
 * Smoothly updates OrbitControls target when focusedPosition changes.
 */
function CameraFocusHandler({ focusedPosition, controlsRef }) {
  useEffect(() => {
    if (focusedPosition && controlsRef.current) {
      controlsRef.current.target.set(focusedPosition[0], 1.5, focusedPosition[2]);
      controlsRef.current.update();
    }
  }, [focusedPosition, controlsRef]);

  return null;
}

/**
 * SceneContainer
 * Core 3D spatial viewport assembling environment lighting, ground terrain,
 * architectural structures, stylized vegetation, spatial data layers, and camera orbit controls.
 */
export default function SceneContainer({ activeLayers, sunTime = 11.0, focusedPosition = null }) {
  const isSunlightActive = activeLayers?.sunlight ?? false;
  const controlsRef = useRef();

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{ position: [20, 15, 25], fov: 45 }}
        style={{ background: '#0b0f19' }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          {/* Base ambient lights */}
          <EnvironmentLighting sunlightActive={isSunlightActive} />

          {/* Ground, plaza & pathways */}
          <GroundPlane />

          {/* Spatial Heat Layer (GLSL Shader overlay y=0.03) */}
          <HeatLayer visible={activeLayers?.heat ?? false} />

          {/* Spatial Sunlight Layer (Dynamic solar light & exposure overlay y=0.035) */}
          <SunlightLayer visible={isSunlightActive} timeOfDay={sunTime} />

          {/* Spatial Noise Layer (Acoustic wave propagation shader overlay y=0.04) */}
          <NoiseLayer visible={activeLayers?.noise ?? false} />

          {/* Active Insight Target Marker (3D ring overlay y=0.06) */}
          <InsightMarker position={focusedPosition} color="#10b981" />

          {/* Architectural structures */}
          <Buildings />

          {/* Stylized trees & environmental accents */}
          <Trees />

          {/* Interactive Camera Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            makeDefault
            enableDamping
            dampingFactor={0.05}
            minDistance={6}
            maxDistance={75}
            maxPolarAngle={Math.PI / 2 - 0.02}
            target={[0, 2, 0]}
          />

          <CameraFocusHandler focusedPosition={focusedPosition} controlsRef={controlsRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
