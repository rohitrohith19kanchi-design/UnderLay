# UNDERLAY

UNDERLAY is an interactive 3D campus-scene prototype for exploring how sun, shade, surface assumptions, and nearby sound sources can vary across a space.

## Current demo model

The bundled scene is an **illustrative scenario**, not a survey of a real campus and not connected to weather services or environmental sensors. The editable default coordinates are a sample New Delhi location. Building/tree geometry, material albedo, and source levels are assumed examples.

- **Sun and shade:** Approximate solar position uses the scenario date, local time, latitude, longitude, and UTC offset. Ground visibility is checked against simplified building boxes and spherical tree-canopy approximations. The clear-sky irradiance number is a proxy; cloud cover, terrain, facade reflection, and local weather are not modeled.
- **Absorbed solar load:** The heat layer estimates shortwave energy absorbed by the ground in W/m² from the clear-sky proxy, assumed surface albedo (0.23 for ground and 0.30 for the plaza), and a diffuse-light allowance under shade. It does **not** estimate air temperature, surface temperature, heat stress, or comfort.
- **Noise:** The sound layer combines assumed point-source levels in dBA by sound energy and applies free-field distance attenuation. It does not model buildings as acoustic barriers, facade/ground reflections, terrain, wind, or source time variation. The displayed source levels are examples, not measurements.
- **Insights:** Cards summarize those scenario estimates. They are not code-compliance, health, safety, or design recommendations.

Scenario controls let a user change sample coordinates, date, UTC offset, and ground/plaza albedo. The noise panel lets a user edit the assumed ambient level and selected source level. The local-time slider updates solar elevation, azimuth, clear-sky proxy, and geometric shadows. Building and source positions remain generic scenario geometry.

## Use with real project data

Before presenting outputs as site-specific, replace the generic geometry with a surveyed model, set the correct location and time zone, use measured/material-specific surface properties, and calibrate sound sources against field measurements. Weather observations or a documented weather dataset are needed for realistic cloud and air-temperature effects. The current prototype deliberately labels its outputs as estimates until those inputs are supplied.

## Run locally

```sh
pnpm install
pnpm dev
```

Run the model checks with:

```sh
pnpm test
```

Build with:

```sh
pnpm build
```
