import React from 'react';

/**
 * Formats float hours (6.0 - 18.0) into human-readable 12-hour AM/PM string (e.g., "10:30 AM")
 */
export function formatTimeOfDay(hoursFloat) {
  const totalMinutes = Math.round(hoursFloat * 60);
  const hours24 = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const period = hours24 >= 12 ? 'PM' : 'AM';
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minsStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const hoursStr = hours12 < 10 ? `0${hours12}` : `${hours12}`;

  return `${hoursStr}:${minsStr} ${period}`;
}

/**
 * SunlightControls
 * Interactive UI panel for controlling solar time-of-day simulation and shadow trajectory.
 */
export default function SunlightControls({ visible, timeOfDay, onChangeTime }) {
  if (!visible) return null;

  const handleSliderChange = (e) => {
    onChangeTime(parseFloat(e.target.value));
  };

  return (
    <div className="sunlight-controls-container">
      <div className="sunlight-header">
        <div className="sunlight-title-group">
          <span className="sunlight-icon">☀️</span>
          <div>
            <h3 className="sunlight-title">Sunlight Analysis</h3>
            <span className="sunlight-desc">Simulated solar exposure & shadow analysis</span>
          </div>
        </div>
        <span className="simulated-badge">SIMULATED DATA — MVP DEMO</span>
      </div>

      <div className="sunlight-slider-section">
        <div className="slider-label-row">
          <label className="slider-caption" htmlFor="sun-time-slider">TIME OF DAY</label>
          <span className="time-display-badge">{formatTimeOfDay(timeOfDay)}</span>
        </div>

        <input
          id="sun-time-slider"
          aria-label="Time of day"
          type="range"
          min="6.0"
          max="18.0"
          step="0.1"
          value={timeOfDay}
          onChange={handleSliderChange}
          className="time-slider"
        />

        <div className="slider-ticks">
          <span>06:00 AM</span>
          <span>12:00 PM</span>
          <span>06:00 PM</span>
        </div>
      </div>
    </div>
  );
}
