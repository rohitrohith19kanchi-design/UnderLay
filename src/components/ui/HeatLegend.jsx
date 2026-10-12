import React from 'react';

/**
 * HeatLegend
 * Floating legend UI for the Heat spatial layer with color scale and simulated data disclaimer.
 */
export default function HeatLegend({ visible }) {
  if (!visible) return null;

  return (
    <div className="heat-legend-container">
      <div className="legend-header">
        <span className="legend-title">Thermal Intensity</span>
        <span className="simulated-badge">SIMULATED DATA — MVP DEMO</span>
      </div>

      <div className="gradient-bar-wrapper">
        <div className="gradient-bar"></div>
      </div>

      <div className="legend-labels">
        <span className="label-low">LOW (Cool)</span>
        <span className="label-mid">MODERATE</span>
        <span className="label-high">HIGH (Hot)</span>
      </div>

      <div className="legend-context-note">
        Central open plaza shows higher heat; shaded tree groves represent cool zones.
      </div>
    </div>
  );
}
