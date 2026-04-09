import type { AlignmentParams } from './types';

/**
 * Pure pixel-composition function — no Canvas API dependency.
 * Red/cyan anaglyph: left eye → R channel, right eye → G+B channels.
 * All three arrays must be the same length (imageWidth × imageHeight × 4).
 */
export function composeAnaglyphPixels(
  leftData: Uint8ClampedArray,
  rightData: Uint8ClampedArray,
  output: Uint8ClampedArray,
): void {
  for (let i = 0; i < output.length; i += 4) {
    output[i]     = leftData[i];       // R from left eye
    output[i + 1] = rightData[i + 1]; // G from right eye
    output[i + 2] = rightData[i + 2]; // B from right eye
    output[i + 3] = 255;              // full alpha
  }
}

/**
 * Full-resolution anaglyph export.
 * Uses OffscreenCanvas — call from main thread only (OffscreenCanvas is transferable).
 * Returns a JPEG Blob at quality 0.92.
 */
export async function exportAnaglyph(
  leftBitmap: ImageBitmap,
  rightBitmap: ImageBitmap,
  params: AlignmentParams,
): Promise<Blob> {
  const { width, height } = leftBitmap;
  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d')!;

  // Sample left eye pixels
  ctx.drawImage(leftBitmap, 0, 0);
  const leftData = ctx.getImageData(0, 0, width, height).data;

  // Sample right eye pixels at shifted position
  const shiftPx = Math.round(params.translateX);
  ctx.clearRect(0, 0, width, height);
  ctx.drawImage(rightBitmap, shiftPx, 0);
  const rightData = ctx.getImageData(0, 0, width, height).data;

  // Compose and write
  const imageData = ctx.createImageData(width, height);
  composeAnaglyphPixels(leftData, rightData, imageData.data);
  ctx.putImageData(imageData, 0, 0);

  return canvas.convertToBlob({ type: 'image/jpeg', quality: 0.92 });
}
