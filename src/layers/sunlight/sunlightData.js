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

  // Building Shadow Zones (Structural occlusion / reduced solar intake)
  { id: 'shadow-tower-north', position: [12, -18], maxExposure: 0.25, radius: 8.0 },
  { id: 'shadow-hub-north', position: [-14, -6], maxExposure: 0.30, radius: 7.0 },

  // Tree Canopy Shaded Zones (Foliage filtering)
  { id: 'tree-shade-west', position: [-5.5, -4.0], maxExposure: 0.35, radius: 6.5 },
  { id: 'tree-shade-east', position: [5.5, -3.5], maxExposure: 0.38, radius: 6.0 },
];
