import React, { useState } from 'react';
import SceneContainer from './components/canvas/SceneContainer.jsx';
import LayerPanel from './components/ui/LayerPanel.jsx';
import HeatLegend from './components/ui/HeatLegend.jsx';
import SunlightControls from './components/ui/SunlightControls.jsx';
import NoiseControls from './components/ui/NoiseControls.jsx';
import SpatialInsights from './components/ui/SpatialInsights.jsx';

function App() {
  const [activeLayers, setActiveLayers] = useState({
    heat: true,
    sunlight: false,
    noise: false,
    crowd: false,
    accessibility: false,
  });

  const [sunTime, setSunTime] = useState(11.0); // Default 11:00 AM
  const [selectedNoiseSource, setSelectedNoiseSource] = useState('road-traffic');

  // Spatial Insights State
  const [showInsights, setShowInsights] = useState(true);
  const [activeInsight, setActiveInsight] = useState(null);

  const handleToggleLayer = (layerId) => {
    setActiveLayers((prev) => ({
      ...prev,
      [layerId]: !prev[layerId],
    }));
  };

  const handleSelectInsight = (insight) => {
    if (activeInsight?.id === insight.id) {
      setActiveInsight(null); // Deselect on toggle
    } else {
      setActiveInsight(insight);
    }
  };

  return (
    <main style={{ width: '100%', height: '100%', position: 'relative' }}>
      {/* Floating Layer Selection Panel */}
      <LayerPanel
        activeLayers={activeLayers}
        onToggleLayer={handleToggleLayer}
      />

      {/* Heat Layer Scale & Disclaimer Legend */}
      <HeatLegend visible={activeLayers.heat} />

      {/* Sunlight Layer Time-of-Day Interactive Controls */}
      <SunlightControls
        visible={activeLayers.sunlight}
        timeOfDay={sunTime}
        onChangeTime={setSunTime}
      />

      {/* Noise Level Acoustic Controls & Source Inspector */}
      <NoiseControls
        visible={activeLayers.noise}
        selectedSourceId={selectedNoiseSource}
        onSelectSource={setSelectedNoiseSource}
      />

      {/* Spatial Decision Insights Panel */}
      {showInsights ? (
        <SpatialInsights
          activeInsightId={activeInsight?.id}
          onSelectInsight={handleSelectInsight}
          onClose={() => setShowInsights(false)}
        />
      ) : (
        <button
          className="reopen-insights-btn"
          onClick={() => setShowInsights(true)}
          title="Open Spatial Insights"
        >
          💡 Spatial Insights
        </button>
      )}

      {/* 3D Spatial Viewport */}
      <SceneContainer
        activeLayers={activeLayers}
        sunTime={sunTime}
        focusedPosition={activeInsight?.position}
      />
    </main>
  );
}

export default App;
