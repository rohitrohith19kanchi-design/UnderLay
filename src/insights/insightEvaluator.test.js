import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateLocation, getSpatialInsights } from './insightEvaluator.js';

test('sunlight reaches zero at sunrise and sunset and peaks at midday', () => {
  const sunrise = evaluateLocation(0, 0, 6).sunlight;
  const midday = evaluateLocation(0, 0, 12).sunlight;
  const sunset = evaluateLocation(0, 0, 18).sunlight;

  assert.equal(sunrise, 0);
  assert.equal(sunset, 0);
  assert.ok(midday > 0);
  assert.ok(midday > evaluateLocation(0, 0, 9).sunlight);
});

test('environment scores stay within normalized bounds', () => {
  for (const hour of [6, 9, 12, 15, 18]) {
    const scores = evaluateLocation(-5.5, -4, hour);
    for (const score of Object.values(scores)) {
      assert.ok(score >= 0 && score <= 1);
    }
  }
});

test('shade locations reduce sunlight exposure in the demo model', () => {
  const shaded = evaluateLocation(-5.5, -4, 12);
  const open = evaluateLocation(0, 0, 12);

  assert.ok(shaded.shadeReduction > 0);
  assert.equal(open.shadeReduction, 0);
});

test('insights use unique sites and update sunlight metrics with the selected time', () => {
  const morning = getSpatialInsights(8);
  const midday = getSpatialInsights(12);
  const ids = morning.map(({ id }) => id);

  assert.equal(new Set(ids).size, ids.length);
  assert.equal(morning.length, 4);
  assert.notEqual(morning[0].metrics.sunlight, midday[0].metrics.sunlight);
  assert.match(midday[0].summary, /simulated layer indices/i);
});
