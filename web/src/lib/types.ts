/** Describes the similarity transform applied to the right eye image.
 *  Left eye is always the reference (see ADR-003).
 *  All values are pixels/degrees/ratios — stored in original image pixel space. */
export interface AlignmentParams {
  translateX: number;  // pixels, positive = shift right
  translateY: number;  // pixels, positive = shift down
  rotateDeg: number;   // degrees, positive = clockwise
  scale: number;       // 1.0 = no change
  keystoneX: number;   // reserved, always 0 in v1
  keystoneY: number;   // reserved, always 0 in v1
}

export function defaultAlignmentParams(): AlignmentParams {
  return { translateX: 0, translateY: 0, rotateDeg: 0, scale: 1.0, keystoneX: 0, keystoneY: 0 };
}

/** Metadata about one eye image — stored in Zustand. Never store ImageBitmap here. */
export interface StereoImageMeta {
  name: string;
  width: number;
  height: number;
  sizeBytes: number;
}
