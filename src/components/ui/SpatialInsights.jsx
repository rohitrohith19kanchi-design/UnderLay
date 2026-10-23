import React from 'react';
import { getSpatialInsights } from '../../insights/insightEvaluator.js';

export default function SpatialInsights({ activeInsightId, onSelectInsight, onClose, timeOfDay = 11, scenarioSettings = {} }) {
  const spatialInsights = getSpatialInsights({ ...scenarioSettings, timeOfDay });

  return (
    <div className="spatial-insights-container">
      <div className="insights-header">
        <div className="insights-title-group">
          <span className="insights-icon" aria-hidden="true">💡</span>
          <div>
            <h3 className="insights-title">Spatial Insights</h3>
            <span className="insights-desc">Illustrative scenario outputs · not measurements</span>
          </div>
        </div>
        <div className="insights-header-actions">
          <span className="simulated-badge">ESTIMATES</span>
          {onClose && <button className="close-btn" onClick={onClose} title="Close Panel" aria-label="Close Spatial Insights">✕</button>}
        </div>
      </div>
      <div className="insights-list">
        {spatialInsights.map((insight) => {
          const isSelected = insight.id === activeInsightId;
          return (
            <div
              role="button"
              tabIndex={0}
              aria-pressed={isSelected}
              key={insight.id}
              className={`insight-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectInsight(insight)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onSelectInsight(insight);
                }
              }}
            >
              <div className="card-top-row">
                <span className="location-tag">📍 {insight.locationLabel}</span>
                <span className="status-pill" style={{ backgroundColor: `${insight.statusColor}22`, color: insight.statusColor, borderColor: `${insight.statusColor}55` }}>{insight.status}</span>
              </div>
              <h4 className="insight-card-title">{insight.title}</h4>
              <p className="insight-summary">{insight.summary}</p>
              <div className="insight-metrics-grid">
                <div><span className="metric-label">ABSORBED LOAD</span><span className="metric-value">{insight.metrics.heat}</span></div>
                <div><span className="metric-label">SUNLIGHT</span><span className="metric-value">{insight.metrics.sunlight}</span></div>
                <div><span className="metric-label">NOISE</span><span className="metric-value">{insight.metrics.noise}</span></div>
              </div>
              <div className="insight-recommendation"><span className="rec-icon" aria-hidden="true">⚡</span>{insight.recommendation}</div>
            </div>
          );
        })}
      </div>
      <p className="scenario-note insights-disclaimer">Generic campus geometry and assumed source levels; clear-sky model with no live weather or sensor feeds. Not for safety or design decisions without calibration.</p>
    </div>
  );
}
