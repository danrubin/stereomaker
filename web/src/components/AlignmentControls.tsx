import type { AlignmentParams } from '../lib/types';

interface AlignmentControlsProps {
  params: AlignmentParams;
  onChange: (patch: Partial<AlignmentParams>) => void;
}

export function AlignmentControls({ params, onChange }: AlignmentControlsProps) {
  return (
    <div className="flex flex-col gap-3 w-full max-w-md">
      <div className="flex items-center gap-4">
        <label htmlFor="hshift" className="text-sm font-medium w-28 shrink-0">
          H-Shift
        </label>
        <input
          id="hshift"
          type="range"
          min={-200}
          max={200}
          step={1}
          value={params.translateX}
          onChange={(e) => onChange({ translateX: Number(e.target.value) })}
          className="flex-1 accent-primary"
        />
        <span className="text-sm tabular-nums w-12 text-right text-muted-foreground">
          {params.translateX > 0 ? '+' : ''}{params.translateX}px
        </span>
      </div>
    </div>
  );
}
