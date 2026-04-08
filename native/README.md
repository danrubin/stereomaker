# StereoMaker Native (macOS + iOS)

## Setup

Open `StereoMaker.xcodeproj` in Xcode (create via File → New → Project, multiplatform, SwiftUI lifecycle).

**Targets:**
- macOS 14+
- iOS 17+

**Folder structure is pre-created.** After creating the Xcode project, add the existing `.swift` files from each folder to the appropriate targets.

## Requirements

- Xcode 16+
- Swift 6+
- No third-party Swift Package dependencies (see ADR-004)

## Running Tests

```
xcodebuild test -scheme StereoMaker -destination 'platform=macOS'
```
