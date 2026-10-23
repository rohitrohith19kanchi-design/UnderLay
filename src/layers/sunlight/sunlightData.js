import { SHADOW_BOXES, SHADOW_CANOPIES } from '../../simulation/siteGeometry.js';
export { DEFAULT_SCENARIO } from '../../simulation/scenario.js';
export { SHADOW_BOXES, SHADOW_CANOPIES };

/** Approximate solar position; azimuth is degrees clockwise from north. */
export function getSolarPosition({ latitude, longitude, date, timeOfDay, timezoneOffsetHours = 0 }) {
  const lat = Number(latitude);
  const lon = Number(longitude);
  const hour = Number(timeOfDay);
  if (![lat, lon, hour, Number(timezoneOffsetHours)].every(Number.isFinite) || Math.abs(lat) > 90 || Math.abs(lon) > 180) {
    return { elevation: -90, azimuth: 0, direction: [0, -1, 0], clearSkyIrradiance: 0 };
  }
  const day = new Date(`${date}T12:00:00Z`);
  if (Number.isNaN(day.getTime())) return { elevation: -90, azimuth: 0, direction: [0, -1, 0], clearSkyIrradiance: 0 };
  const dayOfYear = Math.floor((Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate()) - Date.UTC(day.getUTCFullYear(), 0, 0)) / 86400000);
  const gamma = (2 * Math.PI / 365) * (dayOfYear - 1 + (hour - 12) / 24);
  const equationOfTime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma)
    - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
  const declination = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma)
    - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma)
    - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
  const timeOffset = equationOfTime + 4 * lon - 60 * Number(timezoneOffsetHours);
  const trueSolarMinutes = ((hour * 60 + timeOffset) % 1440 + 1440) % 1440;
  const hourAngle = (trueSolarMinutes / 4 - 180) * Math.PI / 180;
  const latitudeRad = lat * Math.PI / 180;
  const sinElevation = Math.sin(latitudeRad) * Math.sin(declination)
    + Math.cos(latitudeRad) * Math.cos(declination) * Math.cos(hourAngle);
  const elevation = Math.asin(Math.max(-1, Math.min(1, sinElevation))) * 180 / Math.PI;
  const azimuth = (Math.atan2(Math.sin(hourAngle), Math.cos(hourAngle) * Math.sin(latitudeRad)
    - Math.tan(declination) * Math.cos(latitudeRad)) * 180 / Math.PI + 180 + 360) % 360;
  const elevationRad = Math.max(0, elevation) * Math.PI / 180;
  const azimuthRad = azimuth * Math.PI / 180;
  const direction = [Math.sin(azimuthRad) * Math.cos(elevationRad), Math.sin(elevationRad), -Math.cos(azimuthRad) * Math.cos(elevationRad)];
  // Clear-sky horizontal irradiance proxy; not a weather forecast or sensor reading.
  const clearSkyIrradiance = elevation > 0 ? 1000 * Math.sin(elevationRad) * (0.7 + 0.3 * Math.sin(elevationRad)) : 0;
  return { elevation, azimuth, direction, clearSkyIrradiance };
}

function rayHitsBox(x, z, direction, box) {
  const origin = [x, 0.04, z];
  let near = -Infinity;
  let far = Infinity;
  for (let axis = 0; axis < 3; axis += 1) {
    const d = direction[axis];
    if (Math.abs(d) < 1e-8) {
      if (origin[axis] < box.min[axis] || origin[axis] > box.max[axis]) return false;
      continue;
    }
    const t1 = (box.min[axis] - origin[axis]) / d;
    const t2 = (box.max[axis] - origin[axis]) / d;
    near = Math.max(near, Math.min(t1, t2));
    far = Math.min(far, Math.max(t1, t2));
  }
  return far >= Math.max(near, 0);
}

function rayHitsSphere(x, z, direction, [cx, cy, cz, radius]) {
  const ox = x - cx;
  const oy = 0.04 - cy;
  const oz = z - cz;
  const b = ox * direction[0] + oy * direction[1] + oz * direction[2];
  const c = ox * ox + oy * oy + oz * oz - radius * radius;
  const discriminant = b * b - c;
  return discriminant >= 0 && -b + Math.sqrt(discriminant) > 0;
}

/** Whether a ray to the sun intersects simplified campus buildings or tree canopies. */
export function isLocationShaded(x, z, direction, boxes = SHADOW_BOXES, canopies = SHADOW_CANOPIES) {
  if (!direction || direction[1] <= 0) return true;
  return boxes.some((box) => rayHitsBox(x, z, direction, box))
    || canopies.some((canopy) => rayHitsSphere(x, z, direction, canopy));
}
