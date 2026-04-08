import { create } from 'zustand';
import { defaultAlignmentParams } from '../lib/types';
import type { AlignmentParams, StereoImageMeta } from '../lib/types';

// Module-level bitmap storage — not in Zustand (per CLAUDE.md: never store pixel data in Zustand)
const bitmaps: Record<'left' | 'right', ImageBitmap | null> = { left: null, right: null };

export function getBitmap(eye: 'left' | 'right'): ImageBitmap | null {
  return bitmaps[eye];
}

export function setBitmap(eye: 'left' | 'right', bitmap: ImageBitmap): void {
  bitmaps[eye] = bitmap;
}

interface EditorState {
  leftMeta: StereoImageMeta | null;
  rightMeta: StereoImageMeta | null;
  params: AlignmentParams;
  hasBothImages: boolean;
  setEyeImage: (eye: 'left' | 'right', meta: StereoImageMeta, bitmap: ImageBitmap) => void;
  updateParams: (patch: Partial<AlignmentParams>) => void;
}

export const useEditorStore = create<EditorState>((set) => ({
  leftMeta: null,
  rightMeta: null,
  params: defaultAlignmentParams(),
  hasBothImages: false,

  setEyeImage(eye, meta, bitmap) {
    setBitmap(eye, bitmap);
    set((state) => {
      const next = { ...state, [`${eye}Meta`]: meta };
      next.hasBothImages = next.leftMeta !== null && next.rightMeta !== null;
      return next;
    });
  },

  updateParams(patch) {
    set((state) => ({ params: { ...state.params, ...patch } }));
  },
}));
