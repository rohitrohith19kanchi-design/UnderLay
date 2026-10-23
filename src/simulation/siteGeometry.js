/** Simplified geometry for the generic campus scene; dimensions are in metres. */
export const DEMO_TREES = [
  { position: [-5, 0, -5], scale: 1.1, color: '#47754d' },
  { position: [-6.5, 0, -3], scale: 0.95, color: '#557d4d' },
  { position: [5, 0, -5], scale: 1, color: '#4b7847' },
  { position: [6.5, 0, -2.5], scale: 1.2, color: '#527c4b' },
  { position: [-4, 0, 5], scale: 1.05, color: '#47754d' },
  { position: [4, 0, 5.5], scale: 0.9, color: '#5c804f' },
  { position: [5.5, 0, 3.5], scale: 1.15, color: '#497747' },
  { position: [-15, 0, 8], scale: 1.3, color: '#416e45' },
  { position: [-12, 0, 11], scale: 1.1, color: '#557d4d' },
  { position: [16, 0, -4], scale: 1.25, color: '#47754d' },
  { position: [6, 0, -15], scale: 1, color: '#5c804f' },
];

// Axis-aligned building volumes used by both shadow simulation layers.
export const SHADOW_BOXES = [
  { id: 'tech-tower', min: [9.75, 0, -14.25], max: [14.25, 16, -9.75] },
  { id: 'innovation-hub-base', min: [-18.5, 0, -3], max: [-9.5, 7, 3] },
  { id: 'innovation-hub-upper', min: [-18, 7, -2], max: [-12, 10, 3] },
  { id: 'community-pavilion', min: [6.5, 0, 5.5], max: [15.5, 5, 14.5] },
];

// Spherical canopy approximations derived from the tree instances above.
export const SHADOW_CANOPIES = DEMO_TREES.map(({ position: [x, , z], scale }) => [x, 2.8 * scale, z, 1.5 * scale]);
