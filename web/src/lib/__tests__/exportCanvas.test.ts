import { describe, it, expect } from 'vitest';
import { composeAnaglyphPixels } from '../exportCanvas';

describe('composeAnaglyphPixels', () => {
  it('takes red channel from left eye', () => {
    const left  = new Uint8ClampedArray([200, 50, 50, 255]);
    const right = new Uint8ClampedArray([60, 180, 170, 255]);
    const out   = new Uint8ClampedArray(4);
    composeAnaglyphPixels(left, right, out);
    expect(out[0]).toBe(200); // R from left
  });

  it('takes green and blue channels from right eye', () => {
    const left  = new Uint8ClampedArray([200, 50, 50, 255]);
    const right = new Uint8ClampedArray([60, 180, 170, 255]);
    const out   = new Uint8ClampedArray(4);
    composeAnaglyphPixels(left, right, out);
    expect(out[1]).toBe(180); // G from right
    expect(out[2]).toBe(170); // B from right
  });

  it('always outputs full alpha', () => {
    const left  = new Uint8ClampedArray([0, 0, 0, 0]);
    const right = new Uint8ClampedArray([0, 0, 0, 0]);
    const out   = new Uint8ClampedArray(4);
    composeAnaglyphPixels(left, right, out);
    expect(out[3]).toBe(255);
  });

  it('processes multiple pixels', () => {
    // 2 pixels: RGBA × 2 = 8 bytes
    const left  = new Uint8ClampedArray([100, 10, 10, 255,  50,  20,  20, 255]);
    const right = new Uint8ClampedArray([ 30, 90, 80, 255, 120, 200, 190, 255]);
    const out   = new Uint8ClampedArray(8);
    composeAnaglyphPixels(left, right, out);
    // Pixel 0
    expect(out[0]).toBe(100); expect(out[1]).toBe(90); expect(out[2]).toBe(80);  expect(out[3]).toBe(255);
    // Pixel 1
    expect(out[4]).toBe(50);  expect(out[5]).toBe(200); expect(out[6]).toBe(190); expect(out[7]).toBe(255);
  });
});
