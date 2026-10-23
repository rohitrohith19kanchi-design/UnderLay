/** Surface assumptions for the generic demo campus. Albedo is editable scenario input. */
export const SURFACE_MATERIALS = {
  ground: { label: 'Landscape / ground', albedo: 0.23 },
  plaza: { label: 'Concrete plaza', albedo: 0.30 },
};

function boundedAlbedo(value, fallback) {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.min(1, numeric)) : fallback;
}

export function getSurfaceAlbedo(x, z, settings = {}) {
  const plazaAlbedo = boundedAlbedo(settings.plazaAlbedo, SURFACE_MATERIALS.plaza.albedo);
  const groundAlbedo = boundedAlbedo(settings.groundAlbedo, SURFACE_MATERIALS.ground.albedo);
  return Math.max(Math.abs(x), Math.abs(z)) <= 7 ? plazaAlbedo : groundAlbedo;
}

/** Clear-sky absorbed shortwave load proxy in W/m²; not a surface temperature. */
export function estimateAbsorbedSolarLoad(x, z, solarPosition, isShaded, settings = {}) {
  const albedo = getSurfaceAlbedo(x, z, settings);
  const shadeFactor = isShaded ? 0.15 : 1; // diffuse-light allowance under shade
  return Math.max(0, solarPosition.clearSkyIrradiance * (1 - albedo) * shadeFactor);
}
