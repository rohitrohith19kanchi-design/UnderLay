# UNDERLAY
---
## 🚀 Live Demo

**Explore UNDERLAY:** [Open the Live Application](https://underlay-neon.vercel.app)


---

## 📸 UNDERLAY — Visual Showcase

Explore the interactive 3D environment and discover how
UNDERLAY visualizes hidden environmental properties of physical spaces.

### 🌍 Interactive 3D Environment

The 3D environment reveals spatial heat distribution, sunlight exposure,
and environmental conditions across the landscape.



### 🔊 Environmental Noise Visualization

Explore simulated acoustic propagation, identify noise sources,
and discover quieter zones within the environment.



### 💡 Spatial Insights

Discover environmental patterns and spatial recommendations
for identifying comfortable outdoor spaces, quiet zones,
and areas affected by heat and noise.



---
<img width="1850" height="862" alt="cef6340d-a3bb-4cb7-a2f7-2445ed66fbe7" src="https://github.com/user-attachments/assets/a330ccdc-1801-420e-9061-2779b34ab45e" />
<img width="1845" height="862" alt="e5d07670-1343-45cd-ae3b-5c9dd347147d" src="https://github.com/user-attachments/assets/d72d6e26-108e-4734-92d8-e51ead446ca6" />

---

## ✦ What is UNDERLAY?

Physical spaces contain information that isn't immediately visible.

A location may look perfectly fine while actually having:

- 🔥 High heat exposure
- ☀️ Strong sunlight or limited shade
- 🔊 High noise levels
- 🌳 Cooler areas around vegetation
- 🏢 Environmental differences around structures

UNDERLAY turns these invisible properties into interactive visual layers that can be explored directly within a 3D environment.

The goal is not simply to visualize data, but to make spatial information easier to understand and use for decisions about physical spaces.

---

## 🌐 Current Layers

### 🔥 Heat

Visualizes simulated heat intensity across the environment.

**Helps answer:**
> Where are the hottest and coolest areas?

---

### ☀️ Sunlight

Simulates changing sunlight exposure throughout the day.

**Helps answer:**
> Which areas are exposed to sunlight, and how does that change over time?

---

### 🔊 Noise

Visualizes simulated sound propagation from different environmental sources.

**Helps answer:**
> Where are the noisy and quieter areas?

---

## 🧠 Spatial Insights

UNDERLAY combines environmental layers to derive useful spatial observations.

For example:

- **Best for outdoor seating**
  - Lower noise
  - Comfortable heat
  - Partial shade

- **Quiet zone**
  - Low noise
  - Lower heat exposure

- **Heat stress zone**
  - High heat
  - Strong sunlight

The intention is to move from simply asking:

> "What does the environment look like?"

to:

> "What can I understand or decide from this environment?"

---

## 🏗️ How It Works

UNDERLAY represents a physical environment as an interactive 3D scene.

Environmental information is represented as independent spatial layers that can be enabled, disabled, and explored.

```text
Physical Space
      │
      ▼
┌─────────────────────┐
│   3D Environment    │
└──────────┬──────────┘
           │
     ┌─────┼─────┐
     ▼     ▼     ▼
   Heat  Sunlight Noise
     │     │     │
     └─────┼─────┘
           ▼
   Spatial Insights
           │
           ▼
    Better Understanding
    of Physical Spaces
---
```

## Prototype scope

The current scene is a generic illustrative scenario with assumed geometry and source levels; it is not connected to live sensors or weather. Solar position is approximate, the heat layer is an absorbed shortwave-load proxy (not air temperature, surface temperature, or heat stress), and noise is estimated from assumed sources using free-field distance spreading. Treat the visualizations and insights as concept-demo outputs, not calibrated site measurements or design/safety guidance.
