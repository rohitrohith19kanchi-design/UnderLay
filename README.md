# UNDERLAY

> Making the invisible layers of physical spaces visible.

UNDERLAY is an interactive 3D spatial visualization platform that makes hidden environmental properties of physical spaces visible through immersive data layers.

Instead of viewing a place as just buildings, roads, and open areas, UNDERLAY explores what exists beneath that visible layer — heat, sunlight exposure, noise, and other environmental conditions.

The current version uses simulated data to demonstrate the concept through an interactive 3D environment.

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
