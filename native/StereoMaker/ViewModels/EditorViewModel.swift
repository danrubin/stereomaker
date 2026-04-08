import SwiftUI

/// Main view model for the stereo editor screen.
@MainActor
@Observable
final class EditorViewModel {
    var stereoImage: StereoImage?
    var alignmentParams: AlignmentParams = .identity
    var isProcessing: Bool = false
}
