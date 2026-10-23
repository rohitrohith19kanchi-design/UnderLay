import React, { useMemo } from 'react';
import { DEFAULT_SCENARIO, getSolarPosition } from '../../layers/sunlight/sunlightData.js';

export function formatTimeOfDay(hoursFloat) {
  const totalMinutes = ((Math.round(Number(hoursFloat) * 60) % 1440) + 1440) % 1440;
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 || 12;
  return `${String(hours12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

export default function SunlightControls({ visible, timeOfDay, onChangeTime, scenarioSettings = {} }) {
  const settings = useMemo(() => ({ ...DEFAULT_SCENARIO, ...scenarioSettings, timeOfDay }), [scenarioSettings, timeOfDay]);
  const sun = useMemo(() => getSolarPosition(settings), [settings]);
  if (!visible) return null;

  return (
    <div className="sunlight-controls-container">
      <div className="sunlight-header">
        <div className="sunlight-title-group">
          <span className="sunlight-icon" aria-hidden="true">☀️</span>
          <div>
            <h3 className="sunlight-title">Solar Position & Shade</h3>
            <span className="sunlight-desc">Date and coordinates drive sun angle and scene shadows</span>
          </div>
        </div>
        <span className="simulated-badge">SCENARIO</span>
      </div>
      <div className="sunlight-slider-section">
        <div className="slider-label-row">
          <label className="slider-caption" htmlFor="sun-time-slider">LOCAL TIME</label>
          <span className="time-display-badge">{formatTimeOfDay(timeOfDay)}</span>
        </div>
        <input
          id="sun-time-slider"
          aria-label="Local time of day"
          type="range"
          min="0"
          max="24"
          step="0.1"
          value={timeOfDay}
          onChange={(event) => onChangeTime(parseFloat(event.target.value))}
          className="time-slider"
        />
        <div className="slider-ticks"><span>12:00 AM</span><span>12:00 PM</span><span>12:00 AM</span></div>
        <div className="solar-readout">
          {sun.elevation > 0
            ? `Solar elevation ${sun.elevation.toFixed(1)}° · azimuth ${sun.azimuth.toFixed(1)}° · clear-sky proxy ${Math.round(sun.clearSkyIrradiance)} W/m²`
            : 'Sun below horizon · no direct solar load'}
        </div>
      </div>
      <p className="scenario-note">Clear-sky proxy only. Cloud cover and measured weather are not included.</p>
    </div>
  );
}
