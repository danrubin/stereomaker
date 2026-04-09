import { useRef, useState } from 'react';
import type { DragEvent, ChangeEvent } from 'react';

interface DropZoneProps {
  /** Which eye this drop zone is for — shown in the label. */
  eye: 'Left' | 'Right';
  /** Called with the dropped/selected File. */
  onFile: (file: File) => void;
  /** Set to true once an image is loaded, to show the file name. */
  fileName?: string;
}

const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/tiff']);

export function DropZone({ eye, onFile, fileName }: DropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && ACCEPTED_TYPES.has(file.type)) onFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && ACCEPTED_TYPES.has(file.type)) onFile(file);
    // Reset so the same file can be reloaded
    e.target.value = '';
  }

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`Drop ${eye} eye image or click to select`}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
      onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={handleDrop}
      className={[
        'flex flex-col items-center justify-center gap-2',
        'w-64 h-40 rounded-xl border-2 border-dashed',
        'cursor-pointer select-none transition-colors',
        isDragOver
          ? 'border-primary bg-primary/10'
          : 'border-border hover:border-primary/50',
      ].join(' ')}
    >
      <span className="text-sm font-medium text-muted-foreground">
        {eye} Eye
      </span>
      {fileName ? (
        <span className="text-xs text-foreground truncate max-w-[200px]">{fileName}</span>
      ) : (
        <span className="text-xs text-muted-foreground">
          Drop JPEG / PNG / TIFF or click
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/tiff"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
