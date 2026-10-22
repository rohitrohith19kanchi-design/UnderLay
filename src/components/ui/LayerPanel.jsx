import React from 'react';

/**
 * LayerPanel
 * Floating UI panel for toggling spatial environment visualization layers.
 */
export default function LayerPanel({ activeLayers, onToggleLayer }) {
  const layers = [
    {
      id: 'heat',
      name: 'Heat Layer',
      icon: '🔥',
      available: true,
      description: 'Thermal radiation & ground surface heat intensity',
    },
    {
      id: 'sunlight',
      name: 'Sunlight',
      icon: '☀️',
      available: true,
      description: 'Simulated solar exposure & shadow analysis',
    },
    {
      id: 'noise',
      name: 'Noise Level',
      icon: '🔊',
      available: true,
      description: 'Simulated acoustic propagation & ambient decibels',
    },
    {
      id: 'crowd',
      name: 'Crowd Density',
      icon: '👥',
      available: false,
      description: 'Pedestrian flow & movement density',
    },
    {
      id: 'accessibility',
      name: 'Accessibility',
      icon: '♿',
      available: false,
      description: 'Gradient slope & barrier-free spatial paths',
    },
  ];

  return (
    <div className="layer-panel-container">
      <div className="layer-panel-header">
        <div className="panel-title">
          <span className="brand-dot"></span>
          <h2>UNDERLAY</h2>
        </div>
        <span className="panel-subtitle">Spatial Environment Layers</span>
      </div>

      <div className="layer-list">
        {layers.map((layer) => {
          const isActive = activeLayers[layer.id];

          return (
            <button
              type="button"
              key={layer.id}
              className={`layer-item ${isActive ? 'active' : ''} ${!layer.available ? 'disabled' : ''}`}
              onClick={() => layer.available && onToggleLayer(layer.id)}
              aria-pressed={Boolean(isActive)}
              disabled={!layer.available}
            >
              <span className="layer-info">
                <span className="layer-icon" aria-hidden="true">{layer.icon}</span>
                <span className="layer-labels">
                  <span className="layer-name">
                    {layer.name}
                    {!layer.available && <span className="soon-badge">SOON</span>}
                  </span>
                  <span className="layer-desc">{layer.description}</span>
                </span>
              </span>

              {layer.available ? (
                <span className={`toggle-switch ${isActive ? 'on' : ''}`} aria-hidden="true">
                  <span className="toggle-thumb" />
                </span>
              ) : (
                <span className="toggle-disabled-lock" aria-hidden="true">🔒</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
