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
            <div
              key={layer.id}
              className={`layer-item ${isActive ? 'active' : ''} ${!layer.available ? 'disabled' : ''}`}
              onClick={() => layer.available && onToggleLayer(layer.id)}
            >
              <div className="layer-info">
                <span className="layer-icon">{layer.icon}</span>
                <div>
                  <div className="layer-name">
                    {layer.name}
                    {!layer.available && <span className="soon-badge">SOON</span>}
                  </div>
                  <div className="layer-desc">{layer.description}</div>
                </div>
              </div>

              {layer.available ? (
                <div className={`toggle-switch ${isActive ? 'on' : ''}`}>
                  <div className="toggle-thumb" />
                </div>
              ) : (
                <div className="toggle-disabled-lock">🔒</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
