/**
 * insightEvaluator.js
 * Synthesizes multi-layer environmental metrics (Heat, Sunlight, Noise) into actionable spatial insights.
 * Uses centralized thresholds for spatial decision support.
 */

import { HEAT_SOURCES } from '../layers/heat/heatData.js';
import { SUNLIGHT_EXPOSURE_ZONES } from '../layers/sunlight/sunlightData.js';
import { NOISE_SOURCES } from '../layers/noise/noiseData.js';

// Centralized Threshold Constants for Spatial Decision Evaluation
export const EVALUATION_THRESHOLDS = {
  HEAT_HIGH: 0.70,
  HEAT_LOW: 0.30,
  NOISE_HIGH: 0.65,
  NOISE_LOW: 0.35,
  SOLAR_HIGH: 0.70,
  SOLAR_SHADE: 0.40,
};

/**
 * Curated Spatial Insights derived from simulated environmental layer overlap.
 */
export const SPATIAL_INSIGHTS = [
  {
    id: 'outdoor-seating-optimal',
    title: 'Best for Outdoor Seating & Work',
    category: 'Optimal Use',
    status: 'OPTIMAL',
    statusColor: '#10b981', // Emerald
    position: [-5.5, 0, -4.0],
    locationLabel: 'West Tree Grove',
    metrics: {
      heat: 'Low (15%)',
      noise: 'Quiet (38 dBA)',
      sunlight: 'Filtered Shade (35%)',
    },
    summary: 'Ideal microclimate combining natural tree canopy shade, low acoustic disturbance, and cool surface temperatures.',
    recommendation: 'Recommended for outdoor cafe seating, laptop workspaces, and informal meetings.',
  },
  {
    id: 'heat-stress-plaza',
    title: 'Heat & Solar Stress Hazard',
    category: 'Thermal Risk',
    status: 'HIGH CAUTION',
    statusColor: '#f59e0b', // Amber/Orange
    position: [0, 0, 0],
    locationLabel: 'Central Open Plaza',
    metrics: {
      heat: 'Peak (95%)',
      noise: 'Moderate (52 dBA)',
      sunlight: 'Unshaded Solar (95%)',
    },
    summary: 'Unshaded concrete surface absorbing high solar radiation, creating peak surface temperatures during midday hours.',
    recommendation: 'Requires shade canopies or misting structures before placing long-duration seating.',
  },
  {
    id: 'quiet-rest-sanctuary',
    title: 'Quiet Study & Rest Sanctuary',
    category: 'Acoustic Comfort',
    status: 'FAVORABLE',
    statusColor: '#06b6d4', // Cyan/Teal
    position: [-13.5, 0, 9.5],
    locationLabel: 'South-West Outer Park',
    metrics: {
      heat: 'Low (10%)',
      noise: 'Very Quiet (35 dBA)',
      sunlight: 'Moderate Solar (85%)',
    },
    summary: 'Minimal traffic and mechanical noise impact, buffered by park foliage with comfortable environmental metrics.',
    recommendation: 'Suitable for individual reading benches, quiet reflection, or low-sensory rest areas.',
  },
  {
    id: 'mechanical-noise-corridor',
    title: 'Poor Dwell Area (Noise & Heat)',
    category: 'Avoid Dwell',
    status: 'AVOID / UTILITY',
    statusColor: '#a855f7', // Purple/Magenta
    position: [12, 0, -12],
    locationLabel: 'Tech Tower Mechanical Corridor',
    metrics: {
      heat: 'High (78%)',
      noise: 'Loud (70 dBA)',
      sunlight: 'Low Direct Light (25%)',
    },
    summary: 'HVAC chiller noise (~70 dBA) coupled with building envelope heat dissipation.',
    recommendation: 'Restrict to utility access and pedestrian transit. Avoid placing recreational seating.',
  },
];
