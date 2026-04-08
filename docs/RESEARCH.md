# Research Findings

This document tracks the status and findings of open research items R1–R10.
Update each item when resolved and link to any supporting evidence or test results.

---

## R1 — Auto-alignment transform constraint on Apple platforms

**Status:** UNRESOLVED

**Question:** Does `VNTranslationalImageRegistrationRequest` + manual rotation extraction give comparable quality to OpenCV ORB+RANSAC on a set of real-world stereo pairs?

**Hypothesis:** VNTranslationalImageRegistrationRequest handles bulk horizontal shift well, but rotation and scale residuals may require a separate feature-point pass. The combined pipeline should match or exceed OpenCV quality for typical stereo photography scenarios.

**Test plan:**
1. Collect 20 test pairs (rig-shot and handheld) — see `/test-assets/`
2. Implement both: Vision.framework pipeline and OpenCV ORB+RANSAC
3. Run both on all 20 pairs, measure residual vertical disparity and rotation error
4. Compare mean errors and per-pair failure rates

**Success metric:** Mean vertical disparity < 1px after correction on 18/20 pairs.

**Finding:** *(fill in when resolved)*

---

## R2 — OpenCV.js WASM load performance

**Status:** UNRESOLVED

**Question:** Is the ~8MB WASM load acceptable UX? Does it need a loading state / lazy load strategy?

**Hypothesis:** Lazy loading on first auto-align request (not on page load) makes the delay acceptable. A visible progress indicator during the load will prevent confusion.

**Test plan:**
1. Instrument load time with `performance.mark` in the alignment worker
2. Test on a mid-range mobile device (Moto G Power equivalent) on a throttled 4G connection (Chrome DevTools)
3. Measure: time from "auto-align clicked" to "result displayed"

**Success metric:** First auto-align available within 4 seconds of user action on 4G.

**Finding:** *(fill in when resolved)*

---

## R3 — MPO file structure edge cases

**Status:** UNRESOLVED

**Question:** What non-standard MPO variants exist in the wild? Known sources: Fujifilm W1, W3, FinePix Real3D; Nintendo 3DS; some Sony cameras; older Panasonic 3D lens.

**Key MPO spec reference:** CIPA DC-007 standard (Multi-Picture Format) — copy in `/docs/specs/`

**Known gotcha:** Some cameras embed a thumbnail as the third image — parser must skip non-stereo images correctly. Skip any `MPEntry` where `TypeOfIndividualImage = 0x030000` (Large Thumbnail).

**Test plan:**
1. Collect MPO samples from stereosite.com community forums
2. Run parser against all samples, verify L/R extraction is correct for each source
3. Document any variant-specific quirks

**Finding:** *(fill in when resolved)*

---

## R4 — iPhone Spatial Video still extraction

**Status:** UNRESOLVED

**Question:** What is the exact format of stereo data in iPhone 15 Pro / Vision Pro HEIC stills? Is it a dual-image HEIC (like MPO but HEIC), or embedded depth map, or both?

**Test plan:**
1. Shoot spatial content on iPhone 15 Pro
2. Inspect with `exiftool` — look for `kCGImagePropertyGroups`, `GroupImageIndexLeft/Right`
3. Compare `heic-decode` (web WASM) output vs ImageIO on macOS
4. Determine if Apple's `kCGImagePropertyGroups` API is the clean native path

**Note:** Apple added `kCGImagePropertyGroups` in ImageIO for multi-image HEIC — this is the likely solution on native.

**Finding:** *(fill in when resolved)*

---

## R5 — JPS format alignment conventions

**Status:** UNRESOLVED

**Question:** Is the left eye always on the left in JPS, or does it vary? Some sources say it's not standardised.

**Test plan:**
1. Collect JPS files from multiple sources (stereosite.com, personal archives)
2. Check EXIF for `StereoMode` tag on each
3. View each file and confirm which half is the L/R eye by visual inspection
4. Document default assumption and any EXIF override logic needed

**Finding:** *(fill in when resolved)*

---

## R6 — VR180 equirectangular projection maths for stereo

**Status:** UNRESOLVED

**Question:** VR180 requires per-eye equirectangular projection with correct IPD offset. What's the correct formula for a flat stereo pair with known baseline?

**Reference:** Google VR180 Creator spec; YouTube VR180 format documentation.

**Finding:** *(fill in when resolved)*

---

## R7 — GIF export quality vs gifenc alternatives

**Status:** UNRESOLVED

**Question:** Is gifenc the best web GIF encoder for quality + speed? Evaluate: gifenc vs gif.js vs canvas-gif.

**Criteria:**
- Dither quality on photographic images
- Encoding speed for a 10-frame 1000px wiggle GIF
- Bundle size (must be Worker-compatible)

**Finding:** *(fill in when resolved)*

---

## R8 — Anaglyph algorithm variants

**Status:** UNRESOLVED

**Question:** What are the exact colour matrices for each anaglyph mode (true, colour, half-colour, optimised, Dubois)?

**Reference:** Eric Dubois, "Perceptually based conversion of a trichromatic image to a representation intended for a red-green stereoscopic display" — IEEE Signal Processing Letters 2001.

**Finding:** *(fill in when resolved)*

---

## R9 — Mac App Store vs direct sale

**Status:** UNRESOLVED

**Question:** Does the App Sandbox prevent the File System Access patterns we need for batch processing? Specifically: persistent folder bookmarks across launches.

**Test plan:**
1. Prototype sandbox entitlements with `com.apple.security.files.user-selected.read-write`
2. Test folder bookmark persistence using `NSURL bookmarkData` across app launches
3. Determine if MAS distribution is viable or if direct sale (no sandbox) is required

**Finding:** *(fill in when resolved)*

---

## R10 — Competitor / market validation

**Status:** NOT STARTED

**Action:** Post in stereosite.com forums, r/photostereogram, Facebook Stereo Photography group — ask what their biggest SPM pain points are and whether they'd pay for a Mac app.

**Goal:** 20+ responses, at least one person saying they'd pay ≥$20.

**Finding:** *(fill in when complete)*
