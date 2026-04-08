# CLAUDE.md — StereoMaker Project

## Project Purpose
StereoMaker is a stereo/3D photography processing app targeting web, macOS, and iOS.
It is a commercial product. Code quality, UX polish, and correctness matter more than speed.

## Repository Structure
```
/
├── web/                    # Web app (Vite + React + TypeScript)
│   ├── src/
│   │   ├── components/     # React UI components
│   │   ├── workers/        # Web Workers (OpenCV, GIF encoding)
│   │   ├── shaders/        # GLSL shader source files
│   │   ├── lib/            # Core logic (parsers, transforms, alignment)
│   │   └── stores/         # Zustand state stores
│   └── tests/
├── native/                 # Xcode project (macOS + iOS)
│   ├── StereoMaker/
│   │   ├── Views/          # SwiftUI views
│   │   ├── ViewModels/     # ObservableObject view models
│   │   ├── Services/       # Image processing, alignment, export
│   │   ├── Models/         # Value types (StereoImage, AlignmentParams, etc.)
│   │   └── Metal/          # .metal shader files
│   └── StereoMakerTests/
├── test-assets/            # Shared test images (see Section 6 of plan)
├── docs/                   # Architecture decisions, API docs
└── CLAUDE.md               # This file
```

## Core Invariants — Never Violate These

1. **Non-destructive only.** Never write to or modify source image files.
2. **Similarity transforms only.** Stereo alignment must never apply perspective warp or non-uniform scale. Only: translateX, translateY, rotate, uniformScale.
3. **Left eye is always the reference.** Only the right eye image is ever transformed.
4. **Full resolution at export.** Preview may downsample; export never does.
5. **No video code in v1.** If you find yourself reaching for AVFoundation video APIs or FFmpeg, stop. Video is v2.
6. **No ML model dependencies in v1.** Vision.framework and OpenCV classical methods only. No CoreML models, no ONNX, no Python inference.

## Web App Conventions

### TypeScript
- Strict mode always on (`"strict": true` in tsconfig)
- No `any` — use `unknown` and narrow properly
- All image dimensions and coordinates are in **original image pixels** (not CSS pixels, not display pixels)
- Alignment parameters are always a plain serialisable object: `AlignmentParams`

### AlignmentParams Schema (web)
```typescript
interface AlignmentParams {
  translateX: number;   // pixels, positive = shift right
  translateY: number;   // pixels, positive = shift down
  rotateDeg: number;    // degrees, positive = clockwise
  scale: number;        // 1.0 = no change, 1.01 = 1% larger
  keystoneX: number;    // future use, always 0 in v1
  keystoneY: number;    // future use, always 0 in v1
}
```

### WebGL
- One shared WebGL2 context per canvas — never recreate it
- Shaders live in `/web/src/shaders/` as `.glsl` files, imported as strings
- Anaglyph matrix constants live in `/web/src/lib/anaglyphModes.ts`

### State
- Zustand stores in `/web/src/stores/`
- Never put image pixel data (ImageData, Float32Array) in Zustand — store only metadata and params; keep pixel data in refs or module-level variables

### Workers
- All OpenCV.js calls happen in `/web/src/workers/alignment.worker.ts`
- All GIF encoding happens in `/web/src/workers/gifExport.worker.ts`
- Workers communicate via structured clone — transfer ArrayBuffers where possible

## Native App Conventions

### Swift
- Minimum deployment: macOS 14, iOS 17
- SwiftUI-first — no AppKit or UIKit unless there is no SwiftUI equivalent
- All image processing happens off the main thread (use `Task.detached` or `TaskGroup`)
- `AlignmentParams` is a Swift struct matching the web schema above

### Metal
- One `MTLDevice` instance per app (singleton in `MetalRenderer`)
- Shader files in `/native/StereoMaker/Metal/`
- Reuse `MTLCommandQueue` and texture caches

### No Third-Party Dependencies (Native)
For the native app, avoid adding Swift Package dependencies unless the functionality is truly unavailable from Apple frameworks. Prefer: ImageIO, Vision, CoreImage, Metal, Accelerate, PhotosKit.

## Testing Requirements

### Before any PR merge:
- Web: `npm test` passes (Vitest unit tests)
- Native: `xcodebuild test` passes
- No TypeScript errors (`tsc --noEmit`)
- No SwiftLint warnings

### For image processing changes specifically:
- Run the regression test suite against `/test-assets/expected-outputs/`
- If outputs change, attach a visual diff in the PR description and explicitly confirm the change is intentional

## File Formats — Implementation Notes

### MPO
- MPO is a sequence of JPEG images concatenated with APP2 markers
- The first image is the left eye (primary). The second image is the right eye.
- Some cameras add a third image (thumbnail) — skip any image where `MPEntry` attribute `TypeOfIndividualImage = 0x030000` (Large Thumbnail)
- CIPA DC-007 is the spec — a copy is in `/docs/specs/cipa-dc007-mpo.pdf`

### JPS
- A standard JPEG with the extension `.jps`
- Default assumption: left eye on the left half (SBS half-width)
- Check EXIF for `StereoMode` tag if present — it may override the default

### HEIC Spatial (iPhone)
- Use `kCGImagePropertyGroups` key in ImageIO metadata to detect multi-image HEIC
- `kCGImagePropertyGroupImageIndexLeft` and `kCGImagePropertyGroupImageIndexRight` identify the eye images
- See R4 in the project plan — this requires validation before implementation

## Commit Message Convention
```
type(scope): short description

Types: feat, fix, refactor, test, docs, chore
Scopes: web, native, shared, ci

Examples:
feat(web): add Dubois anaglyph mode
fix(native): clamp rotation to ±3° in auto-alignment
test(web): add MPO parser edge case for 3DS files
```

## Key Reference Files
- `/docs/RESEARCH.md` — findings from open research items (R1–R10)
- `/docs/DECISIONS.md` — architecture decision records
- `/test-assets/` — test image library
- `/docs/specs/` — format specs (CIPA MPO, VR180, etc.)
