import test from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULT_SCENARIO, getSolarPosition, isLocationShaded } from '../layers/sunlight/sunlightData.js';
import { estimateAbsorbedSolarLoad } from '../layers/heat/heatData.js';
import { estimateNoiseDba, getNoiseSourcesForScenario } from '../layers/noise/noiseData.js';
import { evaluateLocation, getSpatialInsights } from './insightEvaluator.js';

const dayScenario = { ...DEFAULT_SCENARIO, date: '2026-06-21', timeOfDay: 12 };

test('solar position responds to date, local time, and location', () => {
  const noon = getSolarPosition(dayScenario);
  const night = getSolarPosition({ ...dayScenario, timeOfDay: 0 });
  const winter = getSolarPosition({ ...dayScenario, date: '2026-12-21' });

  assert.ok(noon.elevation > 70 && noon.elevation <= 90);
  assert.equal(night.clearSkyIrradiance, 0);
  assert.ok(winter.elevation < noon.elevation);
  assert.ok(noon.direction[1] > 0);
  const solarNoon = getSolarPosition({ ...dayScenario, timeOfDay: 12.5 });
  const morningSun = getSolarPosition({ ...dayScenario, timeOfDay: 7 });
  const afternoonSun = getSolarPosition({ ...dayScenario, timeOfDay: 17 });
  assert.ok(solarNoon.azimuth > 170 && solarNoon.azimuth < 220);
  assert.ok(morningSun.azimuth < 100 && afternoonSun.azimuth > 250);
});

test('simplified buildings and canopies cast directional shadows', () => {
  const southSun = [0, Math.SQRT1_2, Math.SQRT1_2];
  assert.equal(isLocationShaded(12, -20, southSun), true);
  assert.equal(isLocationShaded(0, -20, southSun), false);
  assert.equal(isLocationShaded(0, 0, [0, -1, 0]), true);
});

test('shade reduces the absorbed solar load proxy', () => {
  const solar = getSolarPosition(dayScenario);
  const shadedLoad = estimateAbsorbedSolarLoad(12, -20, solar, true);
  const openLoad = estimateAbsorbedSolarLoad(0, 0, solar, false);
  assert.ok(openLoad > shadedLoad);
  assert.ok(shadedLoad >= 0);
});

test('point-source sound levels fall with distance and combine energetically', () => {
  const source = [{ position: [0, 0], referenceLevelDba: 60, referenceDistanceM: 1 }];
  const near = estimateNoiseDba(1, 0, source, 0);
  const far = estimateNoiseDba(10, 0, source, 0);
  const combined = estimateNoiseDba(1, 0, [...source, ...source], 0);

  assert.ok(near > far);
  assert.ok(Math.abs(combined - (near + 3.01)) < 0.02);
});

test('insights report estimated physical units and update with scenario time', () => {
  const morning = getSpatialInsights({ ...DEFAULT_SCENARIO, timeOfDay: 8 });
  const midday = getSpatialInsights({ ...DEFAULT_SCENARIO, timeOfDay: 12 });
  const plazaMorning = evaluateLocation(0, 0, { ...DEFAULT_SCENARIO, timeOfDay: 8 });
  const plazaNoon = evaluateLocation(0, 0, { ...DEFAULT_SCENARIO, timeOfDay: 12 });

  assert.equal(new Set(morning.map(({ id }) => id)).size, morning.length);
  assert.notEqual(plazaMorning.clearSkyIrradiance, plazaNoon.clearSkyIrradiance);
  assert.match(midday[0].metrics.heat, /W\/m²/);
  assert.match(midday[0].metrics.noise, /dBA/);
  assert.match(midday[0].modelAssumptions, /no live weather/i);
});
test('surface and acoustic assumptions can be calibrated in the scenario', () => {
  const solar = getSolarPosition(dayScenario);
  const baseLoad = estimateAbsorbedSolarLoad(12, -20, solar, false);
  const reflectiveLoad = estimateAbsorbedSolarLoad(12, -20, solar, false, { groundAlbedo: 0.8 });
  const defaultSources = getNoiseSourcesForScenario(DEFAULT_SCENARIO);
  const quieterSources = getNoiseSourcesForScenario({
    ...DEFAULT_SCENARIO,
    noiseSourceLevels: { ...DEFAULT_SCENARIO.noiseSourceLevels, 'road-traffic': 40 },
  });
  const defaultNoise = estimateNoiseDba(-22, 0, defaultSources, DEFAULT_SCENARIO.ambientNoiseDba);
  const quieterNoise = estimateNoiseDba(-22, 0, quieterSources, DEFAULT_SCENARIO.ambientNoiseDba);

  assert.ok(reflectiveLoad < baseLoad);
  assert.ok(quieterNoise < defaultNoise);
});
