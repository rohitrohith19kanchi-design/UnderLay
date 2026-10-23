import React from 'react';

/** Editable inputs for this illustrative campus; none imply live site data. */
export default function ScenarioControls({ settings, onChange }) {
  const update = (key, value, min, max) => onChange({ ...settings, [key]: Math.max(min, Math.min(max, Number(value))) });
  return (
    <details className="scenario-controls-container">
      <summary>
        <span>Scenario inputs</span>
        <span className="scenario-summary-tag">ILLUSTRATIVE</span>
      </summary>
      <p className="scenario-note">Set coordinates, date, and surface reflectivity for your site. No live weather or sensor feed is connected.</p>
      <div className="scenario-input-grid">
        <label><span>Latitude</span><input type="number" min="-90" max="90" step="0.0001" value={settings.latitude} onChange={(event) => update('latitude', event.target.value, -90, 90)} /></label>
        <label><span>Longitude</span><input type="number" min="-180" max="180" step="0.0001" value={settings.longitude} onChange={(event) => update('longitude', event.target.value, -180, 180)} /></label>
        <label><span>Date</span><input type="date" value={settings.date} onChange={(event) => event.target.value && update('date', event.target.value)} /></label>
        <label><span>UTC offset (hours)</span><input type="number" min="-12" max="14" step="0.25" value={settings.timezoneOffsetHours} onChange={(event) => update('timezoneOffsetHours', event.target.value, -12, 14)} /></label>
        <label><span>Ground albedo (0–1)</span><input type="number" min="0" max="1" step="0.01" value={settings.groundAlbedo} onChange={(event) => update('groundAlbedo', event.target.value, 0, 1)} /></label>
        <label><span>Plaza albedo (0–1)</span><input type="number" min="0" max="1" step="0.01" value={settings.plazaAlbedo} onChange={(event) => update('plazaAlbedo', event.target.value, 0, 1)} /></label>
      </div>
      <p className="scenario-note scenario-footnote">Sun angle uses an approximate solar-position model. Albedo and campus geometry are simplified. Use measured inputs and a surveyed model for site assessment.</p>
    </details>
  );
}
