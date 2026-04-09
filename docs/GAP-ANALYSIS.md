# StereoMaker vs StereoPhoto Maker — Feature Gap Analysis

> Generated: 2026-04-09
> Basis: StereoPhoto Maker (SPM) full feature list vs StereoMaker Feature Registry (v1 plan + Phase 1 complete)

---

## 1. Feature Parity ✅

Features in this project that directly correspond to SPM capabilities.

| SPM Feature | StereoMaker Status | Notes |
|---|---|---|
| Red/cyan anaglyph preview | **Done** (Phase 1) | WebGL2 real-time; SPM uses software rendering |
| Manual H-shift | **Done** (Phase 1) | |
| JPEG/PNG/TIFF input | **Done** (Phase 1) | |
| MPO file support | **Planned** (Phase 2) | Custom parser per CIPA DC-007 |
| JPS file support | **Planned** (Phase 2) | Trivial — SBS JPEG split |
| SBS single-file input | **Planned** (Phase 2) | |
| Over-under single-file input | **Planned** (Phase 2) | |
| HEIC support | **Planned** (Phase 2, needs R4 research) | Native ImageIO path; SPM uses a Susie plugin hack |
| Manual V-shift, rotation, scale, keystone | **Planned** (Phase 3) | |
| Auto-alignment | **Planned** (Phase 3) | Constrained to similarity transform — no full homography |
| Per-eye colour/brightness/contrast | **Planned** (Phase 3) | |
| Per-eye white balance | **Planned** (Phase 3) | |
| Floating frame / edge masking | **Planned** (Phase 3) | |
| Stereo window adjustment | **Planned** (Phase 3) | |
| Additional anaglyph modes | **Planned** (Phase 4) | Green/magenta, amber/blue, optimised/Dubois |
| SBS export (half + full width) | **Planned** (Phase 4) | |
| Over-under export | **Planned** (Phase 4) | |
| Wiggle GIF | **Planned** (Phase 4) | |
| VR180 equirectangular export | **Planned** (Phase 4) | Needs R6 research |
| EXIF/metadata preservation | **Planned** (Phase 4) | |
| Freeview (parallel/cross-eyed) preview | **Planned** (as SBS preview modes) | |
| Batch processing | **Planned** (Phase 5) | |
| Named presets | **Planned** (Phase 5) | |
| Undo/redo | **Planned** — 20 steps | SPM offers 100; may increase |
| Anaglyph JPEG export | **Done** (Phase 1) | |

---

## 2. Gaps — Missing from This Project ❌

### High Priority — Core Stereo Workflow

| SPM Feature | Notes |
|---|---|
| **Left-right swap** | Essential — users frequently load images in the wrong order. Trivial to implement; added to Phase 2. |
| **Lossless JPEG operations** | SPM can swap/join/rotate without re-encoding. StereoMaker always re-encodes. Important for working photographers who can't afford JPEG generation loss. Added to Phase 4. |
| **Depth balance adjustment** | Independent upper/lower/left/right parallax control. SPM's "window mounting" is a key differentiator for professional output. Added to Phase 3. |
| **Gamma correction in anaglyph modes** | SPM applies gamma to colour anaglyphs. Without it, colour anaglyphs look washed out. Part of Phase 4 anaglyph mode work. |
| **Custom anaglyph R/G/B matrix** | SPM lets users define and save their own per-channel mixing ratios + contrast optimisation. Power users expect this. Added to Phase 4. |
| **Auto crop after alignment** | After auto-align, black borders appear. SPM auto-crops to the valid region. Without this, every aligned export has visible artefacts. Added to Phase 3. |
| **Auto brightness/colour match to reference** | SPM matches the right eye's colour to the left when cameras had different exposures. Common with rig shots. Added to Phase 3. |

### Medium Priority — Power User Workflow

| SPM Feature | Notes |
|---|---|
| **Barrel distortion correction** | Critical for Loreo lenses, cheap 3D lenses, and some rig setups. SPM does this per focal length in batch. Added to Phase 4. |
| **Homologous point alignment** | Manual point-pair correspondence for cases where auto-align fails. The professional fallback. Added to Phase 3. |
| **Depth map creation from stereo pairs** | Explicitly deferred to v1.x in the project plan. SPM does this natively; significant user expectation. |
| **HSL colour adjustment** | SPM does real-time hue-specific adjustment. The planned per-eye colour correction is more basic. |
| **Mosaic strip stitching** | Stitching sequential frames into a panorama. Niche but important for panoramic stereo photographers. |
| **Clone brush / depth retouching** | Allows local depth correction by cloning across eyes. Very powerful but complex. |
| **Thumbnail folder browser** | SPM's built-in file browser. On macOS, Quick Look + Finder partially replaces this. |
| **Multi-rename (batch renaming)** | SPM's batch rename retains frame numbers. Important for rig shooters. Added to Phase 5. |
| **Auto colour matching in batch** | Per-pair auto colour correction during batch runs. Added to Phase 5. |

### Low Priority — Niche / Legacy Hardware

| SPM Feature | Notes |
|---|---|
| Autostereoscopic display modes (IZ3D, Sharp 3D LCD, DLP TV) | Dead hardware. Not worth implementing. |
| LC Shutter Glasses (interlacing, page-flip) | Near-dead hardware ecosystem. |
| OpenGL stereo output | Professional 3D workstation monitors only. |
| Looking Glass Portrait calibration | Niche holographic display. Could add later if there is demand. |
| Stereo text/logo overlay | Novelty feature. |
| Stereo card printing | Victorian-format stereocard printing. Niche but charming — possible paid add-on. |
| Google Earth stereo capture | Obscure workflow; Google Earth API has changed significantly. |
| Webpage + Java Applet viewer generation | Java Applet is dead. Skip entirely. |
| IE context menu integration | Skip. |
| Slideshow creation with sound | Video is v2. |
| Lume Pad / RED Hydrogen One / Nubia Pad | Niche autostereoscopic Android devices. |
| Loreo LIAC correction | Very niche — specific to the Loreo LIAC lens adaptor. |
| Household mirror viewing mode | Curiosity feature. |
| 360° panorama auto-scroll / rotation | Phase 4/5 VR work covers the core of this. |
| DAS format support | SPM's proprietary uncompressed alignment format. No other tools use it. |
| PNS extension (JWildfire) | Obscure fractal flame art tool integration. |

---

## 3. This Project's Advantages / Novel Features 🚀

| Feature | Why It Matters |
|---|---|
| **macOS native app** | The entire reason this project exists. SPM is Windows-only; there is no Mac equivalent. This is the core market opportunity. |
| **iOS app** | SPM has no mobile equivalent. iPhone 15 Pro users (spatial video) have no native tool. |
| **Web app (cross-platform, no install)** | SPM requires Windows installation. StereoMaker's web app works on any OS instantly, dramatically lowering the barrier for new users. |
| **iPhone Spatial Video / HEIC stereo** | SPM uses a third-party Susie plugin hack for HEIC. StereoMaker uses Apple's native `kCGImagePropertyGroups` ImageIO API — first-class support for the fastest-growing source of stereo content. |
| **VR180 export** | SPM has no native VR180 output. Positions StereoMaker squarely in the modern VR content workflow. |
| **Modern UI** | SPM's interface is from the early 2000s — functional but visually dated. StereoMaker's SwiftUI/shadcn design is a meaningful UX improvement, especially for new users. |
| **Shareable processing link** | URL-encoded settings let users share not just an image but the exact alignment + export parameters. No equivalent in SPM. |
| **PWA (installable, offline)** | Web app works offline for core tools. |
| **Continuity Camera integration** | Use an iPhone as a live stereo camera input directly in the macOS app. No Windows equivalent. |
| **Apple Shortcuts actions** | Automatable stereo processing workflows. Power users can build system-level batch pipelines without needing SPM's CLI. |
| **Quick Look plugin for .jps/.mpo** | Native Finder preview. SPM requires the app to be open to preview these formats. |
| **Non-destructive parametric workflow** | All edits are stored as `AlignmentParams` — a serialisable JSON object. SPM applies edits destructively unless the DAS format is used. |

---

## 4. Recommended Next Features 📋

After Phase 2 (file formats), in order of impact on core stereo workflow:

| # | Feature | Rationale |
|---|---|---|
| 1 | **Left-right swap** | The single most common user error. One button, trivial to implement. Added to Phase 2. |
| 2 | **Full alignment toolset** (V-shift, rotation, scale, keystone, auto) | Phase 3 as planned — the core differentiator from a mere format converter. |
| 3 | **Auto-crop after alignment** | Without this, every aligned export has black border artefacts. Blocks professional use. Added to Phase 3. |
| 4 | **Auto brightness/colour match** | Rig shots with two cameras almost always have slight exposure differences. Table stakes for rig shooters. Added to Phase 3. |
| 5 | **Gamma correction + Dubois matrix in anaglyph modes** | The planned Phase 4 anaglyph modes won't look professional without this. |
| 6 | **Lossless JPEG support** | Re-encoding on every save is destructive. Affects users who batch-process large archives. Added to Phase 4. |
| 7 | **Additional anaglyph modes** (Phase 4 as planned) | Colour/optimised/Dubois modes are what serious anaglyph users expect. |
| 8 | **Barrel distortion correction** | Many rig shooters use wide-angle or Loreo adapters. Unlocks a significant user segment. Added to Phase 4. |
| 9 | **Depth map creation** (v1.x as planned) | Growing expectation, especially with the rise of spatial computing content. |
| 10 | **Homologous point alignment** | The professional fallback when auto-align fails. Needed before the app can handle difficult pairs reliably. Added to Phase 3. |
