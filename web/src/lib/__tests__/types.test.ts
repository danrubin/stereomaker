import { describe, it, expect } from 'vitest';
import { defaultAlignmentParams } from '../types';

describe('AlignmentParams', () => {
  it('defaultAlignmentParams has identity values', () => {
    const p = defaultAlignmentParams();
    expect(p.translateX).toBe(0);
    expect(p.translateY).toBe(0);
    expect(p.rotateDeg).toBe(0);
    expect(p.scale).toBe(1.0);
    expect(p.keystoneX).toBe(0);
    expect(p.keystoneY).toBe(0);
  });

  it('each call returns a new object', () => {
    expect(defaultAlignmentParams()).not.toBe(defaultAlignmentParams());
  });
});
