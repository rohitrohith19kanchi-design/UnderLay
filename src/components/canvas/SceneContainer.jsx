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
import { DEFAULT_SCENARIO, getSolarPosition } from '../../layers/sunlight/sunlightData.js';

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
export default function SceneContainer({ activeLayers, sunTime = 11.0, scenarioSettings = {}, focusedPosition = null }) {
  const isSunlightActive = activeLayers?.sunlight ?? false;
  const controlsRef = useRef();
  const solarPosition = React.useMemo(() => getSolarPosition({ ...DEFAULT_SCENARIO, ...scenarioSettings, timeOfDay: sunTime }), [scenarioSettings, sunTime]);

  return (
    <div className="scene-container" style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <Canvas
        shadows
        camera={{ position: [20, 15, 25], fov: 45 }}
        style={{ background: '#a9c8d5' }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          {/* Base ambient lights */}
          <EnvironmentLighting sunlightActive={isSunlightActive} solarPosition={solarPosition} />

          {/* Ground, plaza & pathways */}
          <GroundPlane />

          {/* Absorbed shortwave load proxy, with scene-based shade */}
          <HeatLayer visible={activeLayers?.heat ?? false} settings={scenarioSettings} />

          {/* Date-, time-, and location-based sun position and shade */}
          <SunlightLayer visible={isSunlightActive} settings={scenarioSettings} />

          {/* Assumed-source free-field dBA estimate */}
          <NoiseLayer visible={activeLayers?.noise ?? false} settings={scenarioSettings} />

          {/* Active Insight Target Marker (3D ring overlay y=0.06) */}
          <InsightMarker position={focusedPosition} color="#10b981" />

          {/* Generic illustrative campus architecture */}
          <Buildings />

          {/* Generic tree geometry used by the shade model */}
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
