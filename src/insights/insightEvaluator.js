import { estimateAbsorbedSolarLoad } from '../layers/heat/heatData.js';
import { DEFAULT_SCENARIO, getSolarPosition, isLocationShaded } from '../layers/sunlight/sunlightData.js';
import { estimateNoiseDba, getNoiseSourcesForScenario } from '../layers/noise/noiseData.js';

const LOCATIONS = [
  { id: 'outdoor-seating-optimal', title: 'Outdoor Seating & Work', category: 'Use Assessment', position: [-5.5, 0, -4], locationLabel: 'West Tree Grove' },
  { id: 'heat-stress-plaza', title: 'Central Plaza', category: 'Use Assessment', position: [0, 0, 0], locationLabel: 'Central Open Plaza' },
  { id: 'quiet-rest-sanctuary', title: 'Quiet Study & Rest', category: 'Use Assessment', position: [-13.5, 0, 9.5], locationLabel: 'South-West Outer Park' },
  { id: 'mechanical-noise-corridor', title: 'Mechanical Corridor', category: 'Use Assessment', position: [12, 0, -12], locationLabel: 'Tech Tower Mechanical Corridor' },
];

function classify({ absorbedSolarLoad, clearSkyIrradiance, noiseDba }) {
  if (absorbedSolarLoad >= 500 || clearSkyIrradiance >= 700) return { status: 'HIGH SUN EXPOSURE', statusColor: '#f59e0b' };
  if (noiseDba >= 65) return { status: 'HIGH NOISE ESTIMATE', statusColor: '#a855f7' };
  if (absorbedSolarLoad <= 250 && noiseDba <= 50) return { status: 'LOWER EXPOSURE', statusColor: '#10b981' };
  return { status: 'MIXED SCENARIO', statusColor: '#06b6d4' };
}

function recommendation({ absorbedSolarLoad, clearSkyIrradiance, noiseDba, isShaded }) {
  const suggestions = [];
  if (!isShaded && clearSkyIrradiance >= 600) suggestions.push('The clear-sky scenario is sun-exposed here; compare shade options.');
  if (noiseDba >= 65) suggestions.push('The assumed source mix produces elevated free-field noise; verify with a sound meter.');
  if (suggestions.length) return suggestions.join(' ');
  if (absorbedSolarLoad <= 250 && noiseDba <= 50) return 'Lower modeled exposure in this scenario; confirm with site measurements before design decisions.';
  return 'Compare this scenario with measured weather, materials, and acoustic levels before drawing conclusions.';
}

/** Evaluate at a scene point using editable, explicitly illustrative scenario inputs. */
export function evaluateLocation(x, z, input = {}) {
  const settings = { ...DEFAULT_SCENARIO, ...input };
  const solar = getSolarPosition(settings);
  const shaded = isLocationShaded(x, z, solar.direction);
  const absorbedSolarLoad = estimateAbsorbedSolarLoad(x, z, solar, shaded, settings);
  const noiseSources = getNoiseSourcesForScenario(settings);
  const noiseDba = estimateNoiseDba(x, z, noiseSources, settings.ambientNoiseDba);
  return {
    absorbedSolarLoad,
    clearSkyIrradiance: solar.clearSkyIrradiance,
    noiseDba,
    shadeReduction: shaded ? 0.85 : 0,
    isShaded: shaded,
    solarElevation: solar.elevation,
    solarAzimuth: solar.azimuth,
  };
}

/** Insights are model outputs for the selected illustrative scenario, not observations. */
export function getSpatialInsights(settings = {}) {
  const inputs = { ...DEFAULT_SCENARIO, ...settings };
  return LOCATIONS.map((location) => {
    const [x, , z] = location.position;
    const scores = evaluateLocation(x, z, inputs);
    const classification = classify(scores);
    const solarTime = Number(inputs.timeOfDay ?? 11);
    return {
      ...location,
      ...classification,
      metrics: {
        heat: `${Math.round(scores.absorbedSolarLoad)} W/m²`,
        sunlight: `${Math.round(scores.clearSkyIrradiance)} W/m²`,
        noise: `${Math.round(scores.noiseDba)} dBA`,
      },
      summary: `Illustrative clear-sky estimate at ${solarTime.toFixed(1)} local time: ${Math.round(scores.absorbedSolarLoad)} W/m² absorbed solar load, ${Math.round(scores.clearSkyIrradiance)} W/m² horizontal irradiance proxy, ${Math.round(scores.noiseDba)} dBA modeled free-field level${scores.isShaded ? ', with direct sun blocked by the scene geometry' : ''}.`,
      recommendation: recommendation(scores),
      modelAssumptions: 'Generic scene geometry, sample material albedo, assumed source levels, no live weather or acoustic measurements.',
    };
  });
}
