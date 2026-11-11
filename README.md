# Bruno Simon Folio 2025 — Student Edition · 2026

Original project by [Bruno Simon](https://bruno-simon.com/), based on the [official source](https://github.com/brunosimon/folio-2025), commit `70764a94756cc4de564e493c8ba46c4b5fe03ed1`.

Educational edition prepared by **Иванова Надежда Алексеевна, 4 МД4**. The original interactive 3D portfolio, vehicle, Rapier physics, rendering, controls, assets and author identity remain. The addition is one hidden student achievement. See [Student Edition notice](STUDENT-EDITION-NOTICE.md) and [QA report](QA-REPORT.md).

## Student Edition setup

Use Node.js **24** (tested: 24.22.1), npm (tested: 11.9.0). Upstream does not declare an engine; its Vite 8.3.5 requires Node `^20.19.0 || >=22.12.0`.

```bash
npm install --force
cp .env.example .env
npm run dev
npm run build
npm run preview
node tests/student-achievement.test.js
```

Use the URL printed by Vite (normally port 5173; the original instructions below mention the old port 1234). Production files are in `dist/`; preview normally uses port 4173. Do not open `dist/index.html` with `file://`.

The supplied `.env.example` contains only public configuration placeholders. No backend address or credentials are invented. Leave `VITE_SERVER_URL` empty for the original offline mode; shared whispers and online score saving need a separately hosted compatible WebSocket server. GitHub Pages serves static files only. Never commit a private `.env`.

## Secret achievement

After the introduction, with all menus closed, enter:

**↑ ↑ ↓ ↓ ← → ← → B A** (physical arrow keys, then `KeyB`, `KeyA`).

The modal shows “SECRET ACHIEVEMENT”, “NADYA DISCOVERED!”, the student's full name, group and “Student Edition · 2026”. Close using the cross, “Back to the world”, or the original Escape action after the entrance transition. You can discover it repeatedly. It remains hidden on initial load. A physical or external keyboard is needed to enter the code on mobile.

The original Konami listener also accepts WASD/Q alternatives and normally swaps the vehicle. The student listener runs first; opening the shared modal resets the native listener so the exact student sequence does **not** swap the car. Original alternative codes remain available. Native input guarding was added for overlays, text fields and repeated keydown events. No game-control event is cancelled.

## Original controls

| Input | Action |
| --- | --- |
| WASD / arrows | Drive and steer |
| Shift | Boost |
| Left Ctrl / B | Brake |
| Space / Numpad 5 | Jump / hydraulics |
| Enter (also E / F in source) | Interact |
| M | Map |
| L | Mute |
| T | Whisper |
| R | Respawn |
| Number keys / numpad | Hydraulics |
| Left click and drag | Camera |
| H | Honk |
| Escape | Close overlay / open menu |

Original touch movement, two-finger camera gestures and gamepad controls are unchanged. See the original Controls menu for platform-specific mappings.

## Build, hosting and validation

Student repository: https://github.com/e1ova00/homework-4-5

**Live public site:** https://nadya-folio-student-2026.considerateant2.chatgpt.site

The same production build is published on Sites independently of GitHub Actions. Original MP3 music and all runtime assets are retained; three unused WAV source masters remain in GitHub and the full ZIP rather than the hosting upload.

A ready production build is also published on the `gh-pages` branch, with `index.html` at its root and `.nojekyll`. For branch-based hosting, choose Settings → Pages → Deploy from a branch → `gh-pages` → `/ (root)`. The `main` root contains sources, not the production entry page. GitHub currently reports an account billing lock for Actions; a working Pages deployment has not yet been verified.


`.github/workflows/pages.yml` builds and deploys `dist/` on pushes to `main`. In repository Settings → Pages choose **GitHub Actions** as the source. The upstream Vite configuration already uses `base: './'`, compatible with a repository Pages URL. No custom router or asset substitution is used.

See `QA-REPORT.md` for actual checks, warnings and untested hardware. Baseline and modified production builds succeed. The full production application reached gameplay in mobile emulation; the exact code and close button passed with no recorded page errors or HTTP >=400 responses. Desktop gameplay, full driving and real hardware coverage remain incomplete. There are no configured upstream lint or test scripts; the small added Node tests do not require a testing framework. The original compression script regenerates assets and is not a validation test.

Known limitations: large original download and GPU requirements; no online backend configured; external Google Fonts and the original analytics request remain; physical mobile/gamepad testing requires real devices. Software-rendered Chromium cannot establish real-device frame rates or audio quality.

## Attribution and licensing

The original `license.md` is retained byte-for-byte (MIT, Copyright (c) 2025 Bruno Simon). Original package metadata says ISC; this upstream mismatch is preserved and documented. The music's separate CC0 notice and original Behind the Scene credits are retained. No claim is made that every third-party asset is MIT. See `STUDENT-EDITION-NOTICE.md` for details.

---

The original README is preserved below.

# Folio 2025

![image info](./static/social/share-image.png)

## Setup

Create `.env` file based on `.env.example`

Download and install [Node.js](https://nodejs.org/en/download/) then run this followed commands:

``` bash
# Install dependencies
npm install --force

# Serve at localhost:1234
npm run dev

# Build for production in the dist/ directory
npm run build
```

## Game loop

#### 0

- Time
- Inputs

#### 1

- Player:pre-physics (Inputs)

#### 2

- PhysicalVehicle:pre-physics (Player:pre-physics)

#### 3

- Physics

#### 4

- PhysicsWireframe (Physics)
- Objects (Physics)

#### 5

- PhysicalVehicle:post-physics (Player:pre-physics)

#### 6

- Player:post-physics (Physics, PhysicalVehicle:post-physics)

#### 7

- View (Inputs, Player:post-physics)

#### 8

- Intro
- DayCycles
- YearCycles
- Weather (DayCycles, YearCycles)
- Zones (Player:post-physics)
- VisualVehicle (PhysicalVehicle:post-physics, Inputs, Player:post-physics, View)

#### 9

- Wind (Weather)
- Lighting (DayCycles, View)
- Tornado (DayCycles, PhysicalVehicle)
- InteractivePoints (Player:post-physics)
- Tracks (VisualVehicle)

#### 10

- Area++ (View, PhysicalVehicle:post-physics, Player:post-physics, Wind)
- Foliage (VisualVehicle, View)
- Fog (View)
- Reveal (DayCycles)
- Terrain (Tracks)
- Trails (PhysicalVehicle)
- Floor (View)
- Grass (View, Wind)
- Leaves (View, PhysicalVehicle)
- Lightnings (View, Weather)
- RainLines (View, Weather, Reveal)
- Snow (View, Weather, Reveal, Tracks)
- VisualTornado (Tornado)
- WaterSurface (Weather, View)
- Benches (Objects)
- Bricks (Objects)
- ExplosiveCrates (Objects)
- Fences (Objects)
- Lanterns (Objects)
- Whispers (Player)

#### 13

- InstancedGroup (Objects, [SpecificObjects])

#### 14

- Audio (View, Objects)
- Notifications
- Title (PhysicalVehicle:post-physics)

#### 998

- Rendering

#### 999

- Monitoring

## Blender

### Export

- Mute the palette texture node (loaded and set in Three.js `Material` directly)
- Use corresponding export presets
- Don't use compression (will be done later)

### Compress

Run `npm run compress`

Will do the following

#### GLB

- Traverses the `static/` folder looking for glb files (ignoring already compressed files)
- Compresses embeded texture with `etc1s --quality 255` (lossy, GPU friendly)
- Generates new files to preserve originals

#### Texture files

- Traverses the `static/` folder looking for `png|jpg` files (ignoring non-model related folders)
- Compresses with default preset to `--encode etc1s --qlevel 255` (lossy, GPU friendly) or specific preset according to path
- Generates new files to preserve originals

#### UI files

- Traverses the `static/ui.` folder looking for `png|jpg` files
- Compresses to WebP

#### Resources

- https://gltf-transform.dev/cli
- https://github.com/KhronosGroup/KTX-Software?tab=readme-ov-file
- https://github.khronos.org/KTX-Software/ktxtools/toktx.html