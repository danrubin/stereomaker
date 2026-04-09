# StereoMaker Roadmap

> Last updated: 2026-04-09
> Source of truth for what is in/out of each version and phase.
> The gap analysis in `docs/GAP-ANALYSIS.md` informed the additions below (marked `[GA]`).

## Status Key
- `[x]` Complete
- `[~]` In progress
- `[ ]` Not started
- `[?]` Needs research/decision before starting
- `[GA]` Added from gap analysis vs StereoPhoto Maker

---

## Phase 0 — Foundations ✅
*Repo structure, tooling, CI, CLAUDE.md in place.*

- [x] Initialise monorepo (web + native packages)
- [x] Vite + React + TypeScript + Tailwind v4 for web
- [x] shadcn/ui component library
- [x] Zustand state management
- [x] Xcode project scaffold (SwiftUI multiplatform target) — **manual Xcode step required**
- [x] CLAUDE.md with project conventions and invariants
- [x] docs/RESEARCH.md (R1–R10), DECISIONS.md (ADR-001–004), CHANGELOG.md
- [x] test-assets directory tree
- [x] GitHub repository

---

## Phase 1 — Core Rendering Engine ✅
*Load two images, see anaglyph preview, export it.*

**Web (complete):**
- [x] Image loader (JPEG/PNG/TIFF, two-file pair) — Web Worker
- [x] WebGL2 red/cyan anaglyph shader
- [x] Canvas 2D full-resolution export (anaglyph JPEG)
- [x] Manual H-shift slider (±200px)
- [x] Zustand editor store with non-reactive bitmap registry
- [x] DropZone component (drag-and-drop + file input)
- [x] AnaglyphPreview WebGL canvas component
- [x] AlignmentControls component

**Native (pending Xcode project creation):**
- [ ] Image loader (ImageIO framework)
- [ ] Metal anaglyph preview shader
- [ ] CoreImage anaglyph export
- [ ] Manual H-shift slider

**Milestone:** Load two JPEGs → red/cyan anaglyph → export JPEG. ✅ Web complete.

---

## Phase 2 — File Format Support
*Load all the weird formats real stereo photographers use.*

- [ ] MPO parser (web + native) — Fujifilm W1/W3/Real 3D, Nintendo 3DS (R3)
- [ ] JPS support — trivial SBS JPEG split (R5)
- [ ] SBS single-file input — crop to L/R halves
- [ ] Over-under single-file input — crop to top/bottom halves
- [?] HEIC stereo still support (R4 — iPhone 15 Pro / Vision Pro spatial)
- [GA] **Left-right swap** — one-button swap of which eye is left/right. Resolves the most common user error.

---

## Phase 3 — Full Alignment Toolset
*A photographer with a misaligned stereo pair can fix it completely.*

**Manual alignment controls:**
- [ ] Vertical (V-shift) correction
- [ ] Rotation correction (per-eye)
- [ ] Zoom/scale correction (per-eye, uniform scale only — see ADR-001)
- [ ] Keystone correction (per-eye)

**Auto alignment:**
- [ ] Auto-alignment — OpenCV ORB+RANSAC (web), Vision.framework (native) — constrained to similarity transform (R1, R2)
- [ ] Alignment quality feedback (residual misalignment metric display)
- [GA] **Homologous point alignment** — manual point-pair correspondence; professional fallback when auto-align fails

**Post-alignment:**
- [GA] **Auto-crop after alignment** — automatically crop to the valid image region after any alignment correction, eliminating black border artefacts in exports
- [GA] **Auto brightness/colour match** — automatically match right eye exposure/colour to left eye; essential for rig shots with two cameras

**Per-eye colour:**
- [ ] Per-eye hue, saturation, brightness, contrast
- [ ] Per-eye white balance correction

**Other corrections:**
- [ ] Stereo window adjustment (push depth in/out)
- [ ] Floating frame / edge masking
- [GA] **Depth balance adjustment** — independent upper/lower/left/right parallax control for professional window mounting

**Workflow:**
- [ ] Undo/redo stack (minimum 20 steps)

---

## Phase 4 — Export Formats
*All the output formats SPM supports, plus some it doesn't.*

**Anaglyph modes:**
- [ ] Green/magenta anaglyph
- [ ] Amber/blue anaglyph
- [ ] True anaglyph (greyscale)
- [ ] Optimised anaglyph (half-colour)
- [ ] Dubois anaglyph (perceptually optimal — R8)
- [GA] **Gamma correction** in all colour anaglyph modes — without this, colour anaglyphs appear washed out
- [GA] **Custom R/G/B anaglyph matrix** — user-configurable per-channel mixing ratios with contrast optimisation; save/restore custom matrices

**Output formats:**
- [ ] Anaglyph export: JPEG, PNG, TIFF
- [ ] SBS export (half-width and full-width)
- [ ] Over-under export
- [ ] Wiggle GIF (configurable frame rate, size) — (R7)
- [?] VR180 equirectangular output (R6)
- [ ] Export resolution control (original, 50%, custom DPI)
- [ ] EXIF/metadata preservation on all exports
- [GA] **Lossless JPEG export** — swap/join/rotate operations without re-encoding; prevents generation loss for archive-quality workflows
- [GA] **Barrel distortion correction** — per-lens correction for Loreo adapters, wide-angle rig setups, and cheap 3D lenses

---

## Phase 5 — Batch Processing
*Process a folder of 200 stereo pairs unattended.*

- [ ] Batch queue UI
- [ ] Preset save/load (alignment + colour settings)
- [ ] Apply preset to batch
- [ ] Progress reporting + per-file error handling
- [ ] Web: File System Access API integration (R9 — App Sandbox on macOS)
- [ ] Web: fallback `<input type="file" multiple>` for Safari/Firefox
- [GA] **Auto colour matching in batch** — apply auto exposure/colour matching per pair during batch runs
- [GA] **Multi-rename** — batch rename with frame number retention for rig shooter workflows

---

## Phase 6 — Polish & Monetisation
*Something people will pay for.*

**Web:**
- [ ] Paywall integration (Stripe, LemonSqueezy, or Paddle)
- [ ] Feature gating: free = single image; paid = batch + all export formats + advanced corrections
- [ ] Shareable processing link (encode settings in URL hash)
- [ ] PWA manifest + offline support for core tools
- [ ] Performance audit (Lighthouse, bundle size)

**macOS:**
- [ ] Menu bar (File, Edit, View, Process, Window, Help)
- [ ] Keyboard shortcuts (Mac conventions)
- [ ] Quick Look plugin (.jps/.mpo Finder preview)
- [ ] Continuity Camera integration
- [ ] macOS Shortcuts app actions
- [ ] Document-based app (SwiftUI DocumentGroup)
- [ ] Mac App Store submission
- [ ] App Sandbox entitlements audit
- [ ] Notarisation
- [ ] App icons + screenshots

**iOS:**
- [ ] Photos library integration (PhotoKit import/export)
- [ ] Share sheet extension
- [ ] Haptic feedback on alignment snapping
- [ ] Apple Pencil fine alignment
- [ ] TestFlight build
- [ ] App Store screenshots

---

## v1.x — Post-Launch Minor Updates

- [ ] Depth map generation from stereo pair (disparity estimation)
- [ ] AI-enhanced auto-alignment (neural feature matching)
- [ ] Stereo pair shooting guide / alignment assistant
- [ ] Cloud sync of presets (iCloud)
- [ ] HSL real-time hue-specific colour adjustment (per-eye)
- [ ] Clone brush / local depth retouching

---

## v2 — Video

- [ ] Stereo video input (SBS video files)
- [ ] Frame-by-frame alignment for video
- [ ] VR180 video output
- [ ] iPhone Spatial Video full read/write

---

## v3 / Speculative

- [ ] Lenticular print output
- [ ] 3D anaglyph from 2D (AI depth estimation — single image)
- [ ] Real-time stereo preview via two connected cameras
- [ ] Mosaic strip stitching to panorama
- [ ] 360° panorama auto-scroll / rotation
- [ ] Looking Glass Portrait calibration
- [ ] Stereo card printing (Victorian / custom layouts)

---

## Out of Scope — Never

The following SPM features will not be implemented:

- Autostereoscopic display modes (IZ3D, Sharp 3D LCD, DLP TV) — dead hardware
- LC Shutter Glasses / OpenGL stereo — dead hardware
- IE context menu integration — dead platform
- Java Applet stereo viewer generation — dead technology
- DAS proprietary format — SPM-only, no ecosystem
- Loreo LIAC correction — too niche
- Google Earth capture — API incompatibility
- PNS extension (JWildfire) — unrelated tool integration
- Household mirror viewing — novelty only
- RED Hydrogen One / Nubia Pad / Lume Pad — niche Android-only autostereoscopic devices

---

## Open Research Items

See `docs/RESEARCH.md` for full details on R1–R10. Items that gate specific phases:

| Item | Gates |
|---|---|
| R1 — Vision.framework alignment quality | Phase 3 native |
| R2 — OpenCV.js WASM load performance | Phase 3 web |
| R3 — MPO edge cases | Phase 2 |
| R4 — iPhone HEIC spatial format | Phase 2 |
| R5 — JPS left/right convention | Phase 2 |
| R6 — VR180 projection maths | Phase 4 |
| R7 — GIF encoder comparison | Phase 4 |
| R8 — Dubois anaglyph matrices | Phase 4 |
| R9 — Mac App Store sandbox + folder bookmarks | Phase 5/6 |
| R10 — Market validation | Phase 6 pricing |
