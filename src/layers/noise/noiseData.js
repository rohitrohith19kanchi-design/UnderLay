/**
 * noiseData.js
 * Simulated spatial acoustic noise source dataset for UNDERLAY MVP.
 * Positions correspond to X, Z world coordinates in the 3D scene.
 */

export const NOISE_SOURCES = [
  {
    id: 'road-traffic',
    label: 'Perimeter Road Traffic',
    category: 'Traffic',
    position: [-22, 0],
    intensity: 0.90, // Loud
    radius: 18.0,
    decibels: '~75-82 dBA',
    description: 'Continuous low-frequency vehicle noise & tire roll',
  },
  {
    id: 'tower-hvac',
    label: 'Tech Tower Mechanical Yard',
    category: 'HVAC Equipment',
    position: [13, -13],
    intensity: 0.72, // Moderate-High
    radius: 11.0,
    decibels: '~65-72 dBA',
    description: 'Chiller plant vibration & rooftop exhaust fans',
  },
  {
    id: 'hub-transit',
    label: 'Innovation Hub Loading Bay',
    category: 'Transit & Delivery',
    position: [-14, 2],
    intensity: 0.58, // Moderate
    radius: 9.5,
    decibels: '~58-64 dBA',
    description: 'Intermittent freight unloading & idle vehicle noise',
  },
  {
    id: 'plaza-pedestrian',
    label: 'Central Plaza Activity',
    category: 'Pedestrian Flow',
    position: [0, 0],
    intensity: 0.42, // Moderate-Low
    radius: 8.0,
    decibels: '~48-55 dBA',
    description: 'Ambient foot traffic & conversational murmur',
  },
  {
    id: 'park-grove',
    label: 'West Tree Grove (Acoustic Buffer)',
    category: 'Sanctuary Zone',
    position: [-6, -4],
    intensity: 0.15, // Quiet
    radius: 7.0,
    decibels: '~35-42 dBA',
    description: 'Foliage acoustic damping & ambient wind rustle',
  },
];
