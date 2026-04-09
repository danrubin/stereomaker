import { useState, useCallback } from 'react';
import { DropZone } from './components/DropZone';
import { AnaglyphPreview } from './components/AnaglyphPreview';
import { AlignmentControls } from './components/AlignmentControls';
import { loadImageFile } from './lib/imageLoader';
import { exportAnaglyph } from './lib/exportCanvas';
import { useEditorStore, getBitmap } from './stores/editorStore';
import './App.css';

export default function App() {
  const { leftMeta, rightMeta, params, hasBothImages, setEyeImage, updateParams } = useEditorStore();
  const [isExporting, setIsExporting] = useState(false);
  const [exportError, setExportError] = useState<string | null>(null);

  const handleFile = useCallback(async (eye: 'left' | 'right', file: File) => {
    try {
      const bitmap = await loadImageFile(file);
      const meta = { name: file.name, width: bitmap.width, height: bitmap.height, sizeBytes: file.size };
      setEyeImage(eye, meta, bitmap);
    } catch {
      console.error(`Failed to load ${eye} eye image`);
    }
  }, [setEyeImage]);

  async function handleExport() {
    const left  = getBitmap('left');
    const right = getBitmap('right');
    if (!left || !right) return;
    setIsExporting(true);
    setExportError(null);
    try {
      const blob = await exportAnaglyph(left, right, params);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'anaglyph.jpg';
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      setExportError(e instanceof Error ? e.message : 'Export failed');
    } finally {
      setIsExporting(false);
    }
  }

  const leftBitmap  = getBitmap('left');
  const rightBitmap = getBitmap('right');

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center gap-8 py-12 px-4">
      <h1 className="text-3xl font-semibold tracking-tight">StereoMaker</h1>

      {/* Drop zones */}
      <div className="flex flex-wrap gap-6 justify-center">
        <DropZone
          eye="Left"
          onFile={(f) => handleFile('left', f)}
          fileName={leftMeta?.name}
        />
        <DropZone
          eye="Right"
          onFile={(f) => handleFile('right', f)}
          fileName={rightMeta?.name}
        />
      </div>

      {/* Preview + controls */}
      {hasBothImages && leftBitmap && rightBitmap && (
        <>
          <div className="w-full max-w-3xl">
            <AnaglyphPreview
              leftBitmap={leftBitmap}
              rightBitmap={rightBitmap}
              params={params}
            />
          </div>

          <AlignmentControls params={params} onChange={updateParams} />

          <div className="flex flex-col items-center gap-2">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-6 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors"
            >
              {isExporting ? 'Exporting…' : 'Export Anaglyph JPEG'}
            </button>
            {exportError && (
              <p className="text-sm text-destructive">{exportError}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
