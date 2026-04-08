import Foundation

/// Describes the similarity transform applied to the right eye image to align it with the left eye.
/// Left eye is always the immutable reference (see ADR-003).
/// All values are serialisable — this struct can be encoded/decoded as a preset JSON object.
struct AlignmentParams: Codable, Equatable {
    /// Horizontal shift in pixels. Positive = shift right.
    var translateX: Double = 0
    /// Vertical shift in pixels. Positive = shift down.
    var translateY: Double = 0
    /// Rotation in degrees. Positive = clockwise.
    var rotateDeg: Double = 0
    /// Uniform scale factor. 1.0 = no change, 1.01 = 1% larger.
    var scale: Double = 1.0
    /// Reserved for future keystone correction. Always 0 in v1.
    var keystoneX: Double = 0
    /// Reserved for future keystone correction. Always 0 in v1.
    var keystoneY: Double = 0

    static let identity = AlignmentParams()
}
