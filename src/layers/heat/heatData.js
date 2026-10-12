/**
 * heatData.js
 * Simulated spatial heat intensity dataset for UNDERLAY MVP.
 * Positions correspond to X, Z world coordinates in the 3D scene.
 */

export const HEAT_SOURCES = [
  // Central Open Plaza: Unshaded pavement absorbing solar radiation (High heat)
  { id: 'plaza-center', position: [0, 0], intensity: 0.95, radius: 9.5 },
  { id: 'plaza-east', position: [4, 2.5], intensity: 0.85, radius: 8.0 },
  
  // Tech Tower (North-East): High reflective glass facade & HVAC heat release
  { id: 'tower-base', position: [11.5, -11.5], intensity: 0.78, radius: 8.5 },
  
  // Innovation Hub (West): Medium heat footprint
  { id: 'hub-base', position: [-13.5, 0.5], intensity: 0.68, radius: 8.5 },

  // South-East Pavilion: Moderate heat footprint
  { id: 'pavilion-base', position: [10.5, 9.5], intensity: 0.62, radius: 7.5 },

  // Tree Groves / Shaded Canopy Areas (Cool zones / reduced heat)
  { id: 'tree-grove-west', position: [-5.5, -4.0], intensity: 0.15, radius: 7.0 },
  { id: 'tree-grove-east', position: [5.5, -3.5], intensity: 0.18, radius: 6.5 },
  { id: 'tree-grove-south', position: [-4.0, 5.0], intensity: 0.22, radius: 6.0 },
  { id: 'tree-park-outer-west', position: [-13.5, 9.5], intensity: 0.10, radius: 8.0 },
];
