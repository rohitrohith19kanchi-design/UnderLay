import React from 'react';
import { AMBIENT_NOISE_DBA, NOISE_SOURCES } from '../../layers/noise/noiseData.js';

/** Displays and edits assumed scenario levels; the values are not sensor readings. */
export default function NoiseControls({ visible, selectedSourceId, onSelectSource, scenarioSettings = {}, onScenarioChange }) {
  if (!visible) return null;
  const selectedSource = NOISE_SOURCES.find((source) => source.id === selectedSourceId) || NOISE_SOURCES[0];
  const sourceLevel = scenarioSettings.noiseSourceLevels?.[selectedSource.id] ?? selectedSource.referenceLevelDba;
  const updateAmbient = (value) => onScenarioChange({ ...scenarioSettings, ambientNoiseDba: Math.max(0, Math.min(120, Number(value))) });
  const updateSource = (value) => onScenarioChange({
    ...scenarioSettings,
    noiseSourceLevels: { ...scenarioSettings.noiseSourceLevels, [selectedSource.id]: Math.max(0, Math.min(120, Number(value))) },
  });

  return (
    <div className="noise-controls-container">
      <div className="noise-header">
        <div className="noise-title-group">
          <span className="noise-icon" aria-hidden="true">🔊</span>
          <div>
            <h3 className="noise-title">Outdoor Noise Estimate</h3>
            <span className="noise-desc">Free-field point-source model · scenario assumptions</span>
          </div>
        </div>
        <span className="simulated-badge">ESTIMATE</span>
      </div>
      <div className="acoustic-legend-section">
        <div className="acoustic-bar" />
        <div className="acoustic-labels">
          <span className="label-quiet">~35 dBA ambient</span>
          <span className="label-mod">~60 dBA</span>
          <span className="label-loud">~80 dBA</span>
        </div>
      </div>
      <div className="scenario-input-grid noise-input-grid">
        <label>
          <span>Assumed ambient level (dBA)</span>
          <input type="number" min="0" max="120" step="1" value={scenarioSettings.ambientNoiseDba ?? AMBIENT_NOISE_DBA}
            onChange={(event) => updateAmbient(event.target.value)} />
        </label>
        <label>
          <span>{selectedSource.label} at {selectedSource.referenceDistanceM} m (dBA)</span>
          <input type="number" min="0" max="120" step="1" value={sourceLevel}
            onChange={(event) => updateSource(event.target.value)} />
        </label>
      </div>
      <p className="scenario-note">Levels combine by sound energy and decrease with distance. Barriers, reflections, terrain, and weather are not modeled.</p>
      <div className="source-inspector-section">
        <div className="inspector-caption">ASSUMED SOURCES ({NOISE_SOURCES.length})</div>
        <div className="source-chips">
          {NOISE_SOURCES.map((source) => (
            <button type="button" key={source.id}
              className={`source-chip ${source.id === selectedSource.id ? 'selected' : ''}`}
              onClick={() => onSelectSource(source.id)} aria-pressed={source.id === selectedSource.id}>
              {source.label}
            </button>
          ))}
        </div>
        <div className="source-details-box">
          <div className="detail-header">
            <span className="detail-name">{selectedSource.label}</span>
            <span className="detail-dba">{sourceLevel} dBA @ {selectedSource.referenceDistanceM} m</span>
          </div>
          <div className="detail-grid">
            <div><span className="detail-label">CATEGORY</span><span className="detail-val">{selectedSource.category}</span></div>
            <div><span className="detail-label">INPUT TYPE</span><span className="detail-val">Assumed</span></div>
            <div><span className="detail-label">MODEL</span><span className="detail-val">Point source</span></div>
          </div>
          <div className="detail-desc">{selectedSource.description}</div>
        </div>
      </div>
    </div>
  );
}
