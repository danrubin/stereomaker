# Architecture Decisions

This log records significant architecture decisions made during the development of StereoMaker.
Each entry follows the ADR (Architecture Decision Record) format.

---

## ADR-001 — Constrained similarity transform for stereo alignment

**Date:** 2026-04-08
**Status:** Accepted

### Context

Stereo image pairs require alignment to correct for camera rig imperfections or handheld shooting.
The correction must preserve the stereo effect — the perceived 3D geometry depends on the
geometric relationship between the two eye images remaining consistent across the frame.

Full homographic (perspective) transforms have 8 degrees of freedom and can correct arbitrary
planar misalignments, but they introduce keystone and non-uniform scaling that distort the 3D
effect and create vertical disparity that causes eye strain.

### Decision

All stereo alignment in StereoMaker is constrained to a **similarity transform** with 4 degrees of freedom:
- `translateX` — horizontal shift in pixels
- `translateY` — vertical shift in pixels
- `rotateDeg` — rotation in degrees
- `scale` — uniform scale factor (1.0 = no change)

Perspective warp (keystone) and non-uniform scale are explicitly excluded from the alignment model.
The left eye is always the reference; only the right eye is ever transformed.

The `AlignmentParams` interface (TypeScript) and struct (Swift) encode exactly these four values plus
`keystoneX`/`keystoneY` reserved fields that are always 0 in v1.

### Rationale

1. **Stereo photography fundamentals:** Vertical disparity causes unacceptable eye strain. A similarity transform eliminates vertical disparity (via translateY + rotate) without distorting depth cues.
2. **Practical camera rigs:** Real-world stereo pair misalignment from camera rigs or handheld shooting is dominated by translation and slight rotation — rarely requires perspective correction.
3. **Predictable user experience:** Users can understand and manually adjust 4 parameters. An 8-DOF homography would require expert knowledge to adjust manually.
4. **Serialisability:** 4 floats are trivially serialisable as a preset JSON object.

### Consequences

- Auto-alignment must constrain its output to similarity transforms (reject homographic estimates).
- On Apple platforms: use `VNTranslationalImageRegistrationRequest` + clamped rotation extraction (see R1).
- On web: use OpenCV ORB+RANSAC with `estimateAffinePartial2D` (4-DOF) not `findHomography`.
- Pairs with significant perspective distortion (toed-in cameras, extreme lens mismatches) cannot be fully corrected — this is an acceptable limitation for v1.

---

## ADR-002 — WebGL2 for real-time preview, Canvas 2D for export

**Date:** 2026-04-08
**Status:** Accepted

### Context

The anaglyph preview must be real-time (update as the user drags alignment sliders). Export must be
full-resolution and pixel-accurate.

### Decision

- **Preview:** WebGL2 with custom GLSL shaders. One persistent context per canvas, never recreated.
- **Export:** Canvas 2D compositing. Simple, correct, no GPU round-trip required for batch export.

### Rationale

WebGL2 allows sub-millisecond preview updates via texture uploads and shader uniforms.
Canvas 2D export is simpler to reason about for correctness, runs in a Worker, and avoids
GPU readback latency for large images.

### Consequences

- Two rendering code paths must be maintained and kept in sync for colour accuracy.
- WebGL context loss must be handled gracefully (restore textures and shaders on `webglcontextrestored`).

---

## ADR-003 — Left eye as immutable reference

**Date:** 2026-04-08
**Status:** Accepted

### Context

When aligning a stereo pair, one eye must be chosen as the fixed reference and the other transformed.

### Decision

The **left eye is always the immutable reference**. The right eye is always the one transformed.

### Rationale

- Convention matches most stereo photography software (including SPM).
- SBS stereo images conventionally have the left eye on the left — this maps naturally.
- Simplifies the mental model for users: "I am adjusting where the right eye sits relative to the left."

### Consequences

- All `AlignmentParams` values describe the transform applied to the right eye.
- Import of over-under or cross-eyed SBS must correctly assign L/R before alignment.
- If a user loads files in the wrong order (R first), we must provide a "swap eyes" action.

---

## ADR-004 — No third-party dependencies in native app

**Date:** 2026-04-08
**Status:** Accepted

### Context

The native app could use third-party Swift packages for image processing, alignment, or UI.

### Decision

Avoid all third-party Swift Package dependencies unless functionality is genuinely unavailable
from Apple frameworks. Prefer: ImageIO, Vision, CoreImage, Metal, Accelerate, PhotoKit.

### Rationale

- App Store review risk: fewer dependencies = fewer supply-chain concerns.
- Binary size: Apple frameworks are already on-device.
- Longevity: Apple frameworks evolve with the OS; third-party packages may be abandoned.
- Sandbox compatibility: Apple frameworks are pre-approved for sandbox entitlements.

### Consequences

- Some algorithms must be implemented from scratch (e.g., custom MPO parser, GIF writer via ImageIO).
- OpenCV is web-only — native alignment uses Vision.framework (see ADR-001, R1).
