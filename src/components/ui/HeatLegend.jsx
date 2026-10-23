import React from 'react';

export default function HeatLegend({ visible }) {
  if (!visible) return null;
  return (
    <div className="heat-legend-container">
      <div className="legend-header">
        <span className="legend-title">Absorbed Solar Load</span>
        <span className="simulated-badge">W/m² PROXY</span>
      </div>
      <div className="gradient-bar-wrapper"><div className="gradient-bar" /></div>
      <div className="legend-labels">
        <span className="label-low">LOW · 0</span>
        <span className="label-mid">MID · 350</span>
        <span className="label-high">HIGH · 700+</span>
      </div>
      <div className="legend-context-note">Estimated shortwave energy absorbed by the ground using sample albedo and scene shade. This is not air or surface temperature.</div>
    </div>
  );
}
