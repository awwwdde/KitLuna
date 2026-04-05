# KitLuna ◐

**Cinematic 3D studio website — React + TypeScript + Vite + Three.js**

A production-grade WebGL experience featuring:
- Procedural mountain terrain (3 depth layers, GPU-displaced)
- Realistic moon with crater shader
- Animated cloud billboards + valley fog
- Procedural star field
- Scroll-driven cinematic camera with keyframe system
- Bloom, vignette, chromatic aberration, film grain post-processing
- Minimalist overlay UI with staggered scroll reveals

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Build for production
npm run build
```

Requires Node 18+.

---

## Key Files

| File | Purpose |
|------|---------|
| `src/hooks/useCameraRig.ts` | Edit `CAMERA_KEYFRAMES` to change the scroll-to-camera mapping |
| `src/components/ui/UIOverlay.tsx` | Edit section copy and panel positions |
| `src/shaders/mountain.frag` | Adjust rock colours, fog density, moonlight |
| `src/shaders/moon.frag` | Crater positions, terminator, surface detail |
| `src/components/scene/SceneCanvas.tsx` | Post-processing exposure, tone mapping |
| `src/styles/global.css` | Colour variables, fonts |

---

## Architecture

See [`ARCHITECTURE.md`](./ARCHITECTURE.md) for:
- Full component breakdown
- Scene graph diagram
- Scroll animation logic explained
- Performance optimisation guide
- Production deployment checklist

---

## Customising the Camera Path

Open `src/hooks/useCameraRig.ts` and edit `CAMERA_KEYFRAMES`:

```ts
export const CAMERA_KEYFRAMES: CameraKeyframe[] = [
  {
    progress: 0.0,              // scroll position (0 = top, 1 = bottom)
    position: [0, 18, 55],     // camera world position [x, y, z]
    target:   [0, 8, 0],       // lookAt target [x, y, z]
    fov: 65,                   // field of view in degrees
  },
  // ... add as many keyframes as needed
]
```

The camera will smoothly interpolate between keyframes. The `smoothstep` easing is applied per-segment so transitions always feel soft regardless of how far apart the keyframes are.

---

## Customising the Scene Copy

Open `src/components/ui/UIOverlay.tsx` and edit the `<TextPanel>` components. Each panel maps to a scroll section:

```
hero     → 0%–18% scroll
intro    → 18%–38%
mission  → 38%–58%
work     → 58%–80%
outro    → 80%–100%
```

Section boundaries are defined in `src/hooks/useScrollSections.ts`.

---

## Performance Tuning

| Concern | File | What to change |
|---------|------|----------------|
| Low FPS on mobile | `SceneCanvas.tsx` | Reduce `dpr`, use `QUALITY_PRESETS.low` |
| Mountain detail | `MountainLayer.tsx` | Reduce `segments` prop |
| Particle count | `Particles.tsx` | Reduce `PARTICLE_COUNT` |
| Post-processing cost | `PostProcessing.tsx` | Remove `ChromaticAberration` or `Noise` first |
| Shadow quality | `SceneLighting.tsx` | Reduce `shadow-mapSize` to 1024 |

---

## Credits

- Fonts: [Cormorant Garamond](https://fonts.google.com/specimen/Cormorant+Garamond) + [Jost](https://fonts.google.com/specimen/Jost) via Google Fonts
- Noise algorithms: Inigo Quilez (iq.shadertoy.com)
- Rendering: [Three.js](https://threejs.org) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber)
- Post-processing: [@react-three/postprocessing](https://docs.pmnd.rs/react-postprocessing)
