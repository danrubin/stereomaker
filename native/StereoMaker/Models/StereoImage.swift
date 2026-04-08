import Foundation
import CoreGraphics

/// A loaded stereo image pair. Left eye is always the reference.
struct StereoImage {
    let leftEye: CGImage
    let rightEye: CGImage
    let sourceURL: URL?
}
