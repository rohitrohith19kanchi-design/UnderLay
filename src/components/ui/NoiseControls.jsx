import React from 'react';
import { NOISE_SOURCES } from '../../layers/noise/noiseData.js';

/**
 * NoiseControls
 * Floating UI panel for the Noise Level spatial layer, featuring acoustic scale legend,
 * simulated data disclaimer, and interactive noise source inspector.
 */
export default function NoiseControls({ visible, selectedSourceId, onSelectSource }) {
  if (!visible) return null;

  const selectedSource = NOISE_SOURCES.find((s) => s.id === selectedSourceId) || NOISE_SOURCES[0];

  return (
    <div className="noise-controls-container">
      <div className="noise-header">
        <div className="noise-title-group">
          <span className="noise-icon">🔊</span>
          <div>
            <h3 className="noise-title">Noise Level</h3>
            <span className="noise-desc">Simulated acoustic propagation & ambient decibels</span>
          </div>
        </div>
        <span className="simulated-badge">SIMULATED DATA — MVP DEMO</span>
      </div>

      {/* Acoustic Gradient Scale & Legend */}
      <div className="acoustic-legend-section">
        <div className="acoustic-bar"></div>
        <div className="acoustic-labels">
          <span className="label-quiet">QUIET (~35 dBA)</span>
          <span className="label-mod">MODERATE</span>
          <span className="label-loud">LOUD (~80 dBA)</span>
        </div>
      </div>

      {/* Noise Source Selector / Inspector */}
      <div className="source-inspector-section">
        <div className="inspector-caption">ACOUSTIC SOURCES ({NOISE_SOURCES.length})</div>
        <div className="source-chips">
          {NOISE_SOURCES.map((source) => {
            const isSelected = source.id === selectedSource.id;
            return (
              <button
                key={source.id}
                className={`source-chip ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectSource(source.id)}
              >
                {source.label}
              </button>
            );
          })}
        </div>

        {selectedSource && (
          <div className="source-details-box">
            <div className="detail-header">
              <span className="detail-name">{selectedSource.label}</span>
              <span className="detail-dba">{selectedSource.decibels}</span>
            </div>
            <div className="detail-grid">
              <div>
                <span className="detail-label">CATEGORY</span>
                <span className="detail-val">{selectedSource.category}</span>
              </div>
              <div>
                <span className="detail-label">INTENSITY</span>
                <span className="detail-val">{Math.round(selectedSource.intensity * 100)}%</span>
              </div>
              <div>
                <span className="detail-label">PROPAGATION</span>
                <span className="detail-val">{selectedSource.radius}m radius</span>
              </div>
            </div>
            <div className="detail-desc">{selectedSource.description}</div>
          </div>
        )}
      </div>
    </div>
  );
}
