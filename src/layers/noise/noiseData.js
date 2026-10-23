/**
 * Illustrative point-source assumptions for a generic campus. The sound level
 * is set at a stated reference distance; it is not an on-site measurement.
 */
export const AMBIENT_NOISE_DBA = 35;
export const NOISE_SOURCES = [
  { id: 'road-traffic', label: 'Perimeter Road Traffic', category: 'Traffic', position: [-22, 0], referenceLevelDba: 76, referenceDistanceM: 10, description: 'Illustrative steady traffic level at the road edge.' },
  { id: 'tower-hvac', label: 'Tech Tower Mechanical Yard', category: 'HVAC Equipment', position: [13, -13], referenceLevelDba: 72, referenceDistanceM: 1, description: 'Illustrative continuous mechanical plant level near equipment.' },
  { id: 'hub-transit', label: 'Innovation Hub Loading Bay', category: 'Transit & Delivery', position: [-14, 2], referenceLevelDba: 64, referenceDistanceM: 10, description: 'Illustrative intermittent delivery activity at 10 m.' },
  { id: 'plaza-pedestrian', label: 'Central Plaza Activity', category: 'Pedestrian Flow', position: [0, 0], referenceLevelDba: 60, referenceDistanceM: 1, description: 'Illustrative conversation level near a small group.' },
];

export function getNoiseSourcesForScenario(settings = {}) {
  const levels = settings.noiseSourceLevels ?? {};
  return NOISE_SOURCES.map((source) => {
    const value = Number(levels[source.id] ?? source.referenceLevelDba);
    return { ...source, referenceLevelDba: Number.isFinite(value) ? Math.max(0, Math.min(120, value)) : source.referenceLevelDba };
  });
}

/** Free-field point-source spreading with energy-based dB addition. */
export function estimateNoiseDba(x, z, sources = NOISE_SOURCES, ambientDba = AMBIENT_NOISE_DBA) {
  const background = Number.isFinite(Number(ambientDba)) ? Math.max(0, Math.min(120, Number(ambientDba))) : AMBIENT_NOISE_DBA;
  let energy = 10 ** (background / 10);
  for (const source of sources) {
    const distance = Math.max(source.referenceDistanceM, Math.hypot(x - source.position[0], z - source.position[1]));
    const level = source.referenceLevelDba - 20 * Math.log10(distance / source.referenceDistanceM);
    energy += 10 ** (level / 10);
  }
  return 10 * Math.log10(energy);
}
