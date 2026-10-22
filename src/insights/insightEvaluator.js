import { HEAT_SOURCES } from '../layers/heat/heatData.js';
import { SUNLIGHT_EXPOSURE_ZONES, SUNLIGHT_SHADE_ZONES } from '../layers/sunlight/sunlightData.js';
import { NOISE_SOURCES } from '../layers/noise/noiseData.js';

export const EVALUATION_THRESHOLDS = {
  HEAT_HIGH: 0.7,
  HEAT_LOW: 0.3,
  NOISE_HIGH: 0.65,
  NOISE_LOW: 0.35,
  SOLAR_HIGH: 0.7,
};

const clamp01 = (value) => Math.max(0, Math.min(1, value));

function smoothstep01(value) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

function radialFalloff(x, z, position, radius) {
  const distance = Math.hypot(x - position[0], z - position[1]);
  if (radius <= 0 || distance >= radius) return 0;
  return 1 - smoothstep01(distance / radius);
}

/** Return normalized demo scores at a world-space location and hour (6–18). */
export function evaluateLocation(x, z, timeOfDay = 11) {
  const clampedTime = Math.max(6, Math.min(18, Number(timeOfDay) || 6));
  const normalizedTime = (clampedTime - 6) / 12;
  const solarAltitude = normalizedTime === 0 || normalizedTime === 1
    ? 0
    : Math.sin(normalizedTime * Math.PI);

  const heat = clamp01(HEAT_SOURCES.reduce((sum, source) => {
    const falloff = radialFalloff(x, z, source.position, source.radius);
    return sum + source.intensity * falloff * falloff;
  }, 0));

  const baseExposure = SUNLIGHT_EXPOSURE_ZONES.reduce((sum, zone) => (
    sum + zone.maxExposure * radialFalloff(x, z, zone.position, zone.radius)
  ), 0);
  const shade = SUNLIGHT_SHADE_ZONES.reduce((strongest, zone) => (
    Math.max(strongest, zone.reduction * radialFalloff(x, z, zone.position, zone.radius))
  ), 0);
  const sunlight = clamp01(baseExposure * (1 - shade) * solarAltitude);

  const noise = clamp01(NOISE_SOURCES.reduce((strongest, source) => {
    const distance = Math.hypot(x - source.position[0], z - source.position[1]);
    const attenuation = source.radius > 0
      ? source.intensity * Math.max(0, 1 - distance / source.radius)
      : 0;
    return Math.max(strongest, attenuation);
  }, 0));

  return { heat, sunlight, noise, shadeReduction: shade };
}

const locations = [
  {
    id: 'outdoor-seating-optimal',
    title: 'Outdoor Seating & Work',
    category: 'Use Assessment',
    position: [-5.5, 0, -4.0],
    locationLabel: 'West Tree Grove',
  },
  {
    id: 'heat-stress-plaza',
    title: 'Central Plaza',
    category: 'Use Assessment',
    position: [0, 0, 0],
    locationLabel: 'Central Open Plaza',
  },
  {
    id: 'quiet-rest-sanctuary',
    title: 'Quiet Study & Rest',
    category: 'Use Assessment',
    position: [-13.5, 0, 9.5],
    locationLabel: 'South-West Outer Park',
  },
  {
    id: 'mechanical-noise-corridor',
    title: 'Mechanical Corridor',
    category: 'Use Assessment',
    position: [12, 0, -12],
    locationLabel: 'Tech Tower Mechanical Corridor',
  },
];

function classify({ heat, sunlight, noise }) {
  if (heat >= EVALUATION_THRESHOLDS.HEAT_HIGH || sunlight >= EVALUATION_THRESHOLDS.SOLAR_HIGH) {
    return { status: 'HIGH CAUTION', statusColor: '#f59e0b' };
  }
  if (noise >= EVALUATION_THRESHOLDS.NOISE_HIGH) {
    return { status: 'HIGH NOISE', statusColor: '#a855f7' };
  }
  if (heat <= EVALUATION_THRESHOLDS.HEAT_LOW && noise <= EVALUATION_THRESHOLDS.NOISE_LOW) {
    return { status: 'FAVORABLE', statusColor: '#10b981' };
  }
  return { status: 'MIXED', statusColor: '#06b6d4' };
}

function recommendation({ heat, sunlight, noise }) {
  const suggestions = [];
  if (heat >= EVALUATION_THRESHOLDS.HEAT_HIGH || sunlight >= EVALUATION_THRESHOLDS.SOLAR_HIGH) {
    suggestions.push('Consider shade and heat mitigation before adding long-duration seating.');
  }
  if (noise >= EVALUATION_THRESHOLDS.NOISE_HIGH) {
    suggestions.push('Consider acoustic mitigation or limit use to short-duration activity.');
  }
  if (suggestions.length) return suggestions.join(' ');
  if (heat <= EVALUATION_THRESHOLDS.HEAT_LOW && noise <= EVALUATION_THRESHOLDS.NOISE_LOW) {
    return 'A candidate for seating or quiet activity; verify against on-site measurements.';
  }
  return 'Review the layer scores and verify conditions with on-site measurements.';
}

/** Build demo insights from the same datasets used by the rendered layers. */
export function getSpatialInsights(timeOfDay = 11) {
  return locations.map((location) => {
    const [x, , z] = location.position;
    const scores = evaluateLocation(x, z, timeOfDay);
    const classification = classify(scores);
    return {
      ...location,
      ...classification,
      metrics: {
        heat: `${Math.round(scores.heat * 100)}% simulated index`,
        noise: `${Math.round(scores.noise * 100)}% relative index`,
        sunlight: `${Math.round(scores.sunlight * 100)}% at ${Number(timeOfDay).toFixed(1)}h`,
      },
      summary: `Simulated layer indices at this point: heat ${Math.round(scores.heat * 100)}%, relative noise ${Math.round(scores.noise * 100)}%, and sunlight exposure ${Math.round(scores.sunlight * 100)}%.`,
      recommendation: recommendation(scores),
    };
  });
}
