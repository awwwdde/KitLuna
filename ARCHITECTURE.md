# KitLuna — Technical Architecture & Implementation Guide

A production-grade cinematic WebGL studio website.  
Stack: **React 18 + TypeScript + Vite + Three.js (@react-three/fiber) + GSAP**

---

## 1. High-Level Architecture

```
kitluna/
├── index.html
├── vite.config.ts           # GLSL plugin + path aliases
├── src/
│   ├── main.tsx             # React root
│   ├── App.tsx              # Scroll container + composition root
│   ├── glsl.d.ts            # TypeScript shader declarations
│   │
│   ├── styles/
│   │   └── global.css       # CSS variables, resets, fonts
│   │
│   ├── hooks/
│   │   ├── useScrollProgress.ts     # Raw scroll → MotionValue[0..1]
│   │   ├── useCameraRig.ts          # Keyframe-based camera animation
│   │   ├── useScrollSections.ts     # Section detection from progress
│   │   └── usePerformanceMonitor.ts # FPS → quality tier
│   │
│   ├── shaders/
│   │   ├── mountain.vert / .frag    # Procedural terrain
│   │   ├── sky.vert / .frag         # Stars + sky gradient
│   │   ├── moon.vert / .frag        # Crater surface + terminator
│   │   └── cloud.vert / .frag       # Animated billboard clouds
│   │
│   ├── components/
│   │   ├── scene/
│   │   │   ├── SceneCanvas.tsx      # R3F Canvas + scene root
│   │   │   ├── SkyDome.tsx          # Inverted sphere, sky shader
│   │   │   ├── MoonMesh.tsx         # Sphere + glow sprite
│   │   │   ├── MountainLayer.tsx    # Displaced plane geometry
│   │   │   ├── CloudLayer.tsx       # Billboard cloud collection
│   │   │   ├── Particles.tsx        # Point cloud dust motes
│   │   │   ├── SceneLighting.tsx    # Lights rig
│   │   │   └── PostProcessing.tsx   # Bloom + vignette + grain
│   │   │
│   │   ├── camera/
│   │   │   └── CameraController.tsx # Thin wrapper around useCameraRig
│   │   │
│   │   └── ui/
│   │       ├── UIOverlay.tsx        # Composition root for all UI
│   │       ├── Navigation.tsx       # Logo + nav links
│   │       ├── TextPanel.tsx        # Scroll-driven section text
│   │       ├── ProgressDots.tsx     # Section indicator dots
│   │       ├── ScrollHint.tsx       # "Scroll" cue on hero
│   │       └── Loader.tsx           # Full-screen loading screen
│   │
│   └── utils/
│       └── math.ts                  # lerp, remap, smoothstep, expDecay
```

---

## 2. Component & Module Breakdown

### `App.tsx` — Composition Root
The single source of layout truth. Creates a **600vh scroll container** whose sole child is a `position: sticky; height: 100vh` wrapper. This is the foundational pattern for scroll-driven 3D:

- The browser scrolls the tall container normally
- The sticky child stays fixed to the viewport
- `window.scrollY / (containerHeight - viewportHeight)` gives `[0..1]` progress
- That progress drives **everything**: camera, UI panels, shader uniforms

### `SceneCanvas.tsx` — Three.js Root
Wraps R3F `<Canvas>` with production-grade configuration:
- `toneMapping: ACESFilmicToneMapping` — cinematic contrast curve
- `toneMappingExposure: 0.9` — slightly underexposed for drama
- `dpr: [1, 1.5]` — adaptive resolution
- `shadows: "soft"` — PCF soft shadows from moonlight
- `antialias: false` — PostProcessing handles AA via FXAA

### Shader Modules
All visual rendering is **shader-first** — zero external texture dependencies:

| Shader | Technique | Key Effect |
|--------|-----------|------------|
| `mountain.vert` | fBm + ridge noise | Procedural terrain displacement |
| `mountain.frag` | Elevation-based colour banding | Moonlit rock with atmospheric fog |
| `sky.vert` | Depth trick (`gl_Position.z = w`) | Always renders at far plane |
| `sky.frag` | Procedural stars + nebula | Cell-based star field |
| `moon.frag` | Crater SDF + Minnaert limb | Photorealistic moon surface |
| `cloud.frag` | Domain-warped noise + billboard | Animated translucent wisps |

---

## 3. Scene Graph (Render Order)

```
Scene (R3F root)
│
├── CameraController          [no geometry — useFrame only]
├── SceneLighting
│   ├── DirectionalLight      position=[-8, 30, -20]  color=#b8d4ff  "moonlight"
│   ├── AmbientLight          color=#080c20            "starlight fill"
│   ├── HemisphereLight       sky=#1a2550  ground=#040610
│   └── PointLight            position=[0, 2, 10]      "valley bounce"
│
├── SkyDome                   SphereGeometry r=400, BackSide, depthWrite=false
├── MoonMesh
│   ├── Sprite (glow halo)    AdditiveBlending, scale=[28,28,1]
│   └── Mesh (moon sphere)    SphereGeometry r=5.5, 128 segments
│
├── MountainLayer [bg]        PlaneGeometry 160×60, 200 segs, z=-45
├── CloudLayer (high)         9× billboard quads
├── MountainLayer [mid]       PlaneGeometry 130×50, 220 segs, z=-20
├── MountainLayer [fg]        PlaneGeometry 110×40, 240 segs, z=2
│
├── fog                       Three.js Fog [0x0d1228, near=35, far=100]
├── Particles                 Points, 600 verts, AdditiveBlending
│
└── EffectComposer (PostProcessing)
    ├── Bloom                 luminanceThreshold=0.55, mipmapBlur
    ├── ChromaticAberration   offset=0.0005 (lens fringe)
    ├── Vignette              offset=0.25, darkness=0.65
    └── Noise                 opacity=0.04 (film grain GPU-side)
```

**Depth layer logic:**  
The three mountain layers use both Z-position (world space depth) and the shader's `uLayer` uniform to control atmospheric perspective. Fog density increases as the camera moves closer to the foreground — this is done by linear-interpolating `uFogNear` / `uFogFar` inside `useCameraRig`.

---

## 4. Scroll Animation Logic

### The Core Pattern

```
Scroll Y (pixels)
      ↓
useScrollProgress     →  MotionValue<number> [0..1]  (raw)
      ↓
useCameraRig          →  smoothProgress (lerped at 0.055/frame)
      ↓
findSegment()         →  { from, to, localT }
      ↓
smoothstep(localT)    →  eased t per segment
      ↓
lerp(from.*, to.*, t) →  target position + lookAt
      ↓
camera.position.lerp  →  secondary lerp at 0.08/frame (double-cushion)
```

### Camera Keyframes (scroll progress → camera state)

| Progress | Camera Position  | LookAt        | FOV | Feel |
|----------|-----------------|---------------|-----|------|
| 0.00     | [0, 18, 55]     | [0, 8, 0]     | 65° | Wide establishing shot |
| 0.20     | [0, 12, 38]     | [0, 10, 0]    | 60° | Push in, moon rises |
| 0.40     | [6, 8, 22]      | [-2, 6, 0]    | 55° | Drift right, silhouettes |
| 0.60     | [2, 4, 14]      | [0, 5, -10]   | 52° | Low + close, fog drama |
| 0.80     | [-4, 14, 28]    | [0, 10, 0]    | 58° | Rise up, ethereal |
| 1.00     | [0, 16, 40]     | [0, 12, 0]    | 60° | CTA — open, centred |

### Why Double-Lerp?
The scroll progress is lerped once at `0.055` (slow), then camera position is lerped again at `0.08` (slightly faster). This creates the characteristic **"camera catching up"** lag of cinematic websites like Mont-Fort — the landscape feels physically weighted.

### FOV Animation
Compressing FOV (65° → 52° → 60°) during scroll creates a subtle **dolly-zoom feel** — the sense that the world is expanding/compressing as the camera moves. Keep changes small (< 15°) or it reads as a bug.

---

## 5. Performance Optimisation Strategy

### Geometry
| Technique | Implementation |
|-----------|---------------|
| Single PlaneGeometry per layer | No skinning, no index buffer tricks needed |
| GPU displacement (vertex shader) | Zero CPU terrain updates per frame |
| Shared geometry instances | All mountains share the same geo, different materials |
| frustumCulled: true (default) | R3F auto-culls off-screen meshes |

### Shaders
| Technique | Where |
|-----------|-------|
| `dFdx/dFdy` normals | Avoids tangent-space texture lookups in mountain.frag |
| `discard` on transparent frags | Cloud shader skips fill on near-zero alpha |
| 5-octave fBm cap | mountain.vert — more octaves have negligible visual return |
| `uTime` multiplier tuning | Keep animation uniforms slow — avoids aliasing |

### Rendering
| Setting | Value | Reason |
|---------|-------|--------|
| `antialias: false` | Canvas GL option | PostProcessing handles AA |
| `dpr: [1, 1.5]` | Canvas prop | Caps at 1.5× on HiDPI |
| `AdaptiveDpr` | Drei helper | Drops DPR under load |
| `multisampling: 0` | EffectComposer | Avoids double AA |
| `depthWrite: false` | Clouds, sky, particles | Correct transparency + fillrate |
| Shadow map 2048² | DirectionalLight | Only 1 shadow caster needed |

### React
| Technique | Where |
|-----------|-------|
| `useMemo` for uniforms | Prevents new object each render |
| `useMemo` for geometry | Geometry created once |
| Mutate `.value` in `useFrame` | Never set React state from animation loop |
| `frameloop: "always"` | Consistent smooth animation |
| `Suspense` boundaries | Scene loads async — no blocking render |

### `usePerformanceMonitor`
Measures rolling average FPS over 60 frames. Exposes a `QualityTier`:
- **high** (≥55fps): full segments, particles on, DPR 1.5×
- **medium** (≥35fps): reduced segments, particles on, DPR 1.5×
- **low** (<35fps): minimal segments, particles off, DPR 1×

Wire this into `SceneCanvas` props to adapt without page reload.

---

## 6. Code Snippets Reference

### 6a. Scene Setup (SceneCanvas.tsx excerpt)
```tsx
<Canvas
  gl={{
    toneMapping: THREE.ACESFilmicToneMapping,
    toneMappingExposure: 0.9,
    outputColorSpace: THREE.SRGBColorSpace,
    antialias: false,
    powerPreference: 'high-performance',
  }}
  shadows="soft"
  camera={{ fov: 65, near: 0.1, far: 500, position: [0, 18, 55] }}
  dpr={[1, 1.5]}
>
```

### 6b. Camera Scroll Binding (useCameraRig.ts excerpt)
```ts
useFrame(({ camera }) => {
  // 1. Lerp raw scroll for smoothness
  smoothProgress.current += (scrollProgress.get() - smoothProgress.current) * 0.055

  // 2. Find surrounding keyframes
  const { from, to, t } = findSegment(smoothProgress.current)

  // 3. Interpolate target state
  _pos.set(lerp(from.pos[0], to.pos[0], t), ...)

  // 4. Second lerp — "physical weight"
  camera.position.lerp(_pos, 0.08)
  camera.lookAt(_target)

  // 5. FOV animation
  ;(camera as PerspectiveCamera).fov += (targetFov - cam.fov) * 0.06
  camera.updateProjectionMatrix()
})
```

### 6c. Lighting Configuration
```tsx
// Primary moonlight — cool blue-white, soft PCF shadows
<directionalLight
  color={0xb8d4ff}
  intensity={0.55}
  position={[-8, 30, -20]}
  castShadow
  shadow-mapSize={[2048, 2048]}
  shadow-camera-left={-60}   // frustum covers the full scene width
  shadow-camera-right={60}
  shadow-bias={-0.001}       // prevents shadow acne on terrain
/>
// Starlight ambient — barely perceptible, preserves deep shadows
<ambientLight color={0x080c20} intensity={0.8} />
// Sky/ground gradient
<hemisphereLight color={0x1a2550} groundColor={0x040610} intensity={0.4} />
```

### 6d. Fog (Two-Layer Approach)
```tsx
// Layer 1: Three.js scene fog (cheap, linear, affects all objects)
<fog attach="fog" args={[0x0d1228, 35, 100]} />

// Layer 2: Custom fog in mountain.frag (per-pixel, exponential, tweakable per layer)
// mountain.frag:
float fogFactor(float dist) {
  return clamp((dist - uFogNear) / (uFogFar - uFogNear), 0.0, 1.0);
}
// Applied:
lit = mix(lit, uFogColor, fogFactor(length(vWorldPos - uCameraPos)));
```

Using both layers lets you:
- Use Three.js fog for everything (consistent, free)
- Override per-mountain with denser/thinner fog using `uFogNear` / `uFogFar` uniforms
- Animate fog density as the camera descends into the valley (scroll progress 0.5–0.65)

---

## 7. Asset Recommendations

### Textures (optional upgrades — project works without them)

| Asset | Source | Usage |
|-------|--------|-------|
| Moon albedo + normal | NASA CGI Moon Kit (public domain) | Replace procedural moon with real surface data |
| Mountain heightmap | USGS EarthExplorer | Drive `uAmplitude` with real terrain |
| Cloud RGBA noise | Inigo Quilez cloud texture | Replace procedural cloud noise |
| Star map | ESO/NASA FITS converted to EXR | Replace procedural stars |
| HDRI night sky | HDRI Haven — "Moonlit Golf Course" | Use as EnvMap for reflections |

### Fonts
- **Display**: Cormorant Garamond (Google Fonts) — editorial, razor-thin serifs
- **UI**: Jost 100–300 (Google Fonts) — geometric, legible, premium feel
- Alternatives: Playfair Display / Neue Haas Grotesk, Editorial New / Aktiv Grotesk

### Audio (optional)
A subtle ambient wind/drone layer transforms the experience:
- Use the Web Audio API with a gain envelope driven by scroll progress
- Source: freesound.org — "mountain wind ambience" (Creative Commons)
- Implement with user interaction gating (autoplay policies)

---

## 8. Cinematic Quality Best Practices

### Lighting is everything
The single most impactful decision. One cool directional light + near-black ambient = instant cinematic feel. Fight the urge to add fill lights. Deep, hard shadows on mountain ridges read as dramatic. Flat lighting reads as a game.

### Easing is the soul of the camera
Every camera interpolation needs **two lerps** (as implemented here). The second lerp is what creates the physical weight — the sensation that the camera has inertia and is "catching up." Without it, movement feels like a slider. With it, it feels like a crane shot.

### Colour grading over colour picking
Don't try to make individual objects look good. Make the whole frame look good. ACESFilmicToneMapping + `toneMappingExposure: 0.9` + the Bloom post-process creates a consistent palette across all objects. Then the film grain and vignette make it feel finished.

### Typography is part of the composition
The panels are positioned by design — not by accident. `left: 8%` for left-aligned panels, `right: 8%` for right-aligned. These were chosen so text sits in the negative space of the mountain composition, not in front of key features. Adjust the `TextPanel` positions after seeing the actual scene in motion.

### The rule of atmospheric perspective
Every additional depth layer should be:
1. More desaturated (mix toward grey)
2. More blue-shifted (closer to fog colour)
3. Lower contrast (shadows lifted)

This happens automatically via the `uLayer` uniform in `mountain.frag` + the fog calculation. But verify it looks right at every scroll position — especially at progress 0.6 where the camera is lowest.

### Frame budget allocation
At 16.67ms (60fps) budget:
- Terrain (3 layers): ~3ms vertex shader
- Sky + moon: ~1.5ms
- Clouds (9 quads): ~2ms
- PostProcessing: ~2.5ms
- React overhead: ~0.5ms
- **Buffer**: ~6.5ms — use this for audio, additional VFX, or UI animations

### Mobile considerations
- Cap DPR at 1× on mobile (`dpr: typeof window !== 'undefined' && window.innerWidth < 768 ? 1 : [1, 1.5]`)
- Reduce mountain segments to 96 on mobile
- Disable particles on mobile
- Consider a `prefers-reduced-motion` check and stop camera animation if set

---

## 9. Production Deployment Checklist

- [ ] Enable Vite `build.rollupOptions.output.manualChunks` to split Three.js into its own chunk
- [ ] Add `<link rel="preconnect" href="https://fonts.googleapis.com">` in `index.html`
- [ ] Set `crossOrigin="anonymous"` on any external font/image requests
- [ ] Add `loading="eager"` and dimensions to any `<img>` tags
- [ ] Test `prefers-reduced-motion` — stop camera animation, freeze clouds
- [ ] Add `aria-label` to the canvas element: `"Cinematic 3D mountain landscape"`
- [ ] Ensure all interactive UI elements meet WCAG 2.1 AA contrast ratios
- [ ] Set `Cache-Control: public, max-age=31536000, immutable` for hashed JS/CSS chunks
- [ ] Add Open Graph image (a static screenshot) for social sharing
- [ ] Test on Safari (WebGL2 behaviour differs slightly — check shader precision)
- [ ] Profile with Chrome DevTools WebGL inspector for texture/buffer leaks
- [ ] Add error boundary around `<Canvas>` with a graceful static fallback
