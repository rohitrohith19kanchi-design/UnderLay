import React, { useState } from 'react';
import SceneContainer from './components/canvas/SceneContainer.jsx';
import LayerPanel from './components/ui/LayerPanel.jsx';
import HeatLegend from './components/ui/HeatLegend.jsx';
import SunlightControls from './components/ui/SunlightControls.jsx';
import NoiseControls from './components/ui/NoiseControls.jsx';
import SpatialInsights from './components/ui/SpatialInsights.jsx';
import ScenarioControls from './components/ui/ScenarioControls.jsx';
import { DEFAULT_SCENARIO } from './layers/sunlight/sunlightData.js';

function App() {
  const [activeLayers, setActiveLayers] = useState({
    heat: true,
    sunlight: false,
    noise: false,
    crowd: false,
    accessibility: false,
  });
  const [sunTime, setSunTime] = useState(11.0);
  const [scenarioSettings, setScenarioSettings] = useState(DEFAULT_SCENARIO);
  const [selectedNoiseSource, setSelectedNoiseSource] = useState('road-traffic');
  const [showInsights, setShowInsights] = useState(true);
  const [activeInsight, setActiveInsight] = useState(null);

  const handleToggleLayer = (layerId) => {
    setActiveLayers((previous) => ({ ...previous, [layerId]: !previous[layerId] }));
  };

  const handleSelectInsight = (insight) => {
    setActiveInsight((previous) => previous?.id === insight.id ? null : insight);
  };

  return (
    <main style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div className="ui-overlay">
        <LayerPanel activeLayers={activeLayers} onToggleLayer={handleToggleLayer} />
        <ScenarioControls settings={scenarioSettings} onChange={setScenarioSettings} />
        <HeatLegend visible={activeLayers.heat} />
        <SunlightControls
          visible={activeLayers.sunlight}
          timeOfDay={sunTime}
          onChangeTime={setSunTime}
          scenarioSettings={scenarioSettings}
        />
        <NoiseControls
          visible={activeLayers.noise}
          selectedSourceId={selectedNoiseSource}
          onSelectSource={setSelectedNoiseSource}
          scenarioSettings={scenarioSettings}
          onScenarioChange={setScenarioSettings}
        />
        {showInsights ? (
          <SpatialInsights
            activeInsightId={activeInsight?.id}
            onSelectInsight={handleSelectInsight}
            onClose={() => setShowInsights(false)}
            timeOfDay={sunTime}
            scenarioSettings={scenarioSettings}
          />
        ) : (
          <button className="reopen-insights-btn" onClick={() => setShowInsights(true)} title="Open Spatial Insights">
            💡 Spatial Insights
          </button>
        )}
      </div>
      <SceneContainer
        activeLayers={activeLayers}
        sunTime={sunTime}
        scenarioSettings={{ ...scenarioSettings, timeOfDay: sunTime }}
        focusedPosition={activeInsight?.position}
      />
    </main>
  );
}

export default App;
