import { SURFACE_MATERIALS } from '../layers/heat/heatData.js';
import { AMBIENT_NOISE_DBA, NOISE_SOURCES } from '../layers/noise/noiseData.js';

const now = new Date();
const localDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

/** Sample inputs for the illustrative campus only; none are field measurements. */
export const DEFAULT_SCENARIO = {
  label: 'Illustrative campus scenario',
  locationLabel: 'New Delhi · sample coordinates',
  latitude: 28.6139,
  longitude: 77.2090,
  timezoneOffsetHours: 5.5,
  date: localDate,
  groundAlbedo: SURFACE_MATERIALS.ground.albedo,
  plazaAlbedo: SURFACE_MATERIALS.plaza.albedo,
  ambientNoiseDba: AMBIENT_NOISE_DBA,
  noiseSourceLevels: Object.fromEntries(NOISE_SOURCES.map((source) => [source.id, source.referenceLevelDba])),
};
