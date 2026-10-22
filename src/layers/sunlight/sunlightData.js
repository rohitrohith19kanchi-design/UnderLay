/**
 * sunlightData.js
 * Simulated solar exposure dataset for UNDERLAY MVP.
 * Defines spatial solar irradiance baseline values across the site terrain.
 */

export const SUNLIGHT_EXPOSURE_ZONES = [
  // Central Open Plaza: Unobstructed sky exposure (High solar intake)
  { id: 'plaza-open', position: [0, 0], maxExposure: 0.95, radius: 11.0 },
  { id: 'plaza-east-field', position: [5, 3], maxExposure: 0.90, radius: 9.0 },

  // Roof / Open Field North-West
  { id: 'field-northwest', position: [-8, -12], maxExposure: 0.88, radius: 10.0 },

  // Open Ground South-West
  { id: 'field-southwest', position: [-12, 10], maxExposure: 0.85, radius: 9.0 },
];

// Occlusion is modeled as a reduction, not a positive exposure source.
export const SUNLIGHT_SHADE_ZONES = [
  { id: 'shadow-tower-north', position: [12, -18], reduction: 0.65, radius: 8.0 },
  { id: 'shadow-hub-north', position: [-14, -6], reduction: 0.55, radius: 7.0 },
  { id: 'tree-shade-west', position: [-5.5, -4.0], reduction: 0.6, radius: 6.5 },
  { id: 'tree-shade-east', position: [5.5, -3.5], reduction: 0.55, radius: 6.0 },
];
