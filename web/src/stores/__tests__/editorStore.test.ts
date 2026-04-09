import { describe, it, expect, beforeEach } from 'vitest';
import { useEditorStore, getBitmap, setBitmap } from '../editorStore';

describe('editorStore', () => {
  beforeEach(() => {
    setBitmap('left', null);
    setBitmap('right', null);
    useEditorStore.setState({
      leftMeta: null,
      rightMeta: null,
      params: { translateX: 0, translateY: 0, rotateDeg: 0, scale: 1.0, keystoneX: 0, keystoneY: 0 },
    });
  });

  it('starts with no images loaded', () => {
    const { leftMeta, rightMeta } = useEditorStore.getState();
    expect(leftMeta).toBeNull();
    expect(rightMeta).toBeNull();
  });

  it('setLeftImage stores meta', () => {
    useEditorStore.getState().setEyeImage('left', { name: 'L.jpg', width: 800, height: 600, sizeBytes: 1000 }, {} as ImageBitmap);
    expect(useEditorStore.getState().leftMeta?.name).toBe('L.jpg');
    expect(useEditorStore.getState().leftMeta?.width).toBe(800);
  });

  it('setRightImage stores meta', () => {
    useEditorStore.getState().setEyeImage('right', { name: 'R.jpg', width: 800, height: 600, sizeBytes: 1000 }, {} as ImageBitmap);
    expect(useEditorStore.getState().rightMeta?.name).toBe('R.jpg');
  });

  it('setBitmap / getBitmap stores ImageBitmap outside reactive state', () => {
    const fakeBitmap = { width: 100, height: 100 } as ImageBitmap;
    setBitmap('left', fakeBitmap);
    expect(getBitmap('left')).toBe(fakeBitmap);
  });

  it('updateParams merges partial params', () => {
    useEditorStore.getState().updateParams({ translateX: 12 });
    expect(useEditorStore.getState().params.translateX).toBe(12);
    expect(useEditorStore.getState().params.scale).toBe(1.0);
  });

  it('hasBothImages is false when only one eye loaded', () => {
    useEditorStore.getState().setEyeImage('left', { name: 'L.jpg', width: 800, height: 600, sizeBytes: 1 }, {} as ImageBitmap);
    expect(useEditorStore.getState().hasBothImages).toBe(false);
  });

  it('hasBothImages is true when both eyes loaded', () => {
    const meta = { name: 'x.jpg', width: 800, height: 600, sizeBytes: 1 };
    useEditorStore.getState().setEyeImage('left', meta, {} as ImageBitmap);
    useEditorStore.getState().setEyeImage('right', meta, {} as ImageBitmap);
    expect(useEditorStore.getState().hasBothImages).toBe(true);
  });
});
