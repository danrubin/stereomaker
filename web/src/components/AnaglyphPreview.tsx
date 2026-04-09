import { useEffect, useRef } from 'react';
import { AnaglyphRenderer } from '../lib/webgl/anaglyphRenderer';
import type { AlignmentParams } from '../lib/types';

interface AnaglyphPreviewProps {
  leftBitmap: ImageBitmap;
  rightBitmap: ImageBitmap;
  params: AlignmentParams;
}

export function AnaglyphPreview({ leftBitmap, rightBitmap, params }: AnaglyphPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<AnaglyphRenderer | null>(null);

  // Initialise renderer once on mount
  useEffect(() => {
    if (!canvasRef.current) return;
    const renderer = new AnaglyphRenderer(canvasRef.current);
    rendererRef.current = renderer;
    return () => {
      renderer.dispose();
      rendererRef.current = null;
    };
  }, []);

  // Re-upload textures when bitmaps change
  useEffect(() => {
    rendererRef.current?.setImages(leftBitmap, rightBitmap);
  }, [leftBitmap, rightBitmap]);

  // Re-render when params or bitmaps change
  useEffect(() => {
    rendererRef.current?.render(params.translateX, leftBitmap.width);
  }, [params, leftBitmap, rightBitmap]);

  // Fit canvas to image aspect ratio
  const aspectRatio = leftBitmap.width / leftBitmap.height;

  return (
    <canvas
      ref={canvasRef}
      width={leftBitmap.width}
      height={leftBitmap.height}
      style={{ aspectRatio, width: '100%', maxWidth: leftBitmap.width }}
      className="rounded-lg shadow-md"
    />
  );
}
