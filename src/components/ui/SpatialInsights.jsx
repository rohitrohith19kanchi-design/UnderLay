import React from 'react';
import { SPATIAL_INSIGHTS } from '../../insights/insightEvaluator.js';

/**
 * SpatialInsights
 * Floating UI panel displaying spatial decision-support recommendations
 * derived from synthesized Heat, Sunlight, and Noise simulated layers.
 */
export default function SpatialInsights({ activeInsightId, onSelectInsight, onClose }) {
  return (
    <div className="spatial-insights-container">
      <div className="insights-header">
        <div className="insights-title-group">
          <span className="insights-icon">💡</span>
          <div>
            <h3 className="insights-title">Spatial Insights</h3>
            <span className="insights-desc">Environmental Decision Support</span>
          </div>
        </div>
        <div className="insights-header-actions">
          <span className="simulated-badge">SIMULATED DATA</span>
          {onClose && (
            <button className="close-btn" onClick={onClose} title="Close Panel">
              ✕
            </button>
          )}
        </div>
      </div>

      <div className="insights-list">
        {SPATIAL_INSIGHTS.map((insight) => {
          const isSelected = insight.id === activeInsightId;

          return (
            <div
              key={insight.id}
              className={`insight-card ${isSelected ? 'selected' : ''}`}
              onClick={() => onSelectInsight(insight)}
            >
              <div className="card-top-row">
                <span className="location-tag">📍 {insight.locationLabel}</span>
                <span
                  className="status-pill"
                  style={{
                    backgroundColor: `${insight.statusColor}22`,
                    color: insight.statusColor,
                    borderColor: `${insight.statusColor}55`,
                  }}
                >
                  {insight.status}
                </span>
              </div>

              <h4 className="insight-card-title">{insight.title}</h4>
              <p className="insight-summary">{insight.summary}</p>

              {/* Metrics Breakdown */}
              <div className="insight-metrics-grid">
                <div>
                  <span className="metric-label">HEAT</span>
                  <span className="metric-value">{insight.metrics.heat}</span>
                </div>
                <div>
                  <span className="metric-label">SUNLIGHT</span>
                  <span className="metric-value">{insight.metrics.sunlight}</span>
                </div>
                <div>
                  <span className="metric-label">NOISE</span>
                  <span className="metric-value">{insight.metrics.noise}</span>
                </div>
              </div>

              <div className="insight-recommendation">
                <span className="rec-icon">⚡</span> {insight.recommendation}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
