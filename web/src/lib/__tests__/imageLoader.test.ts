import { describe, it, expect, vi, beforeEach } from 'vitest';

// Worker mock — must be defined before importing imageLoader
const mockWorkerInstance = {
  onmessage: null as ((e: MessageEvent) => void) | null,
  onerror: null as ((e: ErrorEvent) => void) | null,
  postMessage: vi.fn(),
  terminate: vi.fn(),
};

vi.stubGlobal(
  'Worker',
  vi.fn(function () {
    return mockWorkerInstance;
  })
);

import { loadImageFile } from '../imageLoader';

describe('loadImageFile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWorkerInstance.onmessage = null;
    mockWorkerInstance.onerror = null;
  });

  it('posts the file to the worker', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const promise = loadImageFile(file);

    expect(mockWorkerInstance.postMessage).toHaveBeenCalledWith(file);

    // Resolve the promise by simulating worker response
    const fakeBitmap = { width: 100, height: 100 } as ImageBitmap;
    mockWorkerInstance.onmessage?.({ data: { bitmap: fakeBitmap } } as MessageEvent);

    const result = await promise;
    expect(result).toBe(fakeBitmap);
  });

  it('terminates the worker after success', async () => {
    const file = new File([''], 'test.jpg', { type: 'image/jpeg' });
    const promise = loadImageFile(file);
    const fakeBitmap = { width: 50, height: 50 } as ImageBitmap;
    mockWorkerInstance.onmessage?.({ data: { bitmap: fakeBitmap } } as MessageEvent);
    await promise;
    expect(mockWorkerInstance.terminate).toHaveBeenCalledOnce();
  });

  it('rejects when the worker errors', async () => {
    const file = new File([''], 'bad.jpg', { type: 'image/jpeg' });
    const promise = loadImageFile(file);
    const fakeError = new ErrorEvent('error', { message: 'decode failed' });
    mockWorkerInstance.onerror?.(fakeError);
    await expect(promise).rejects.toBe(fakeError);
  });
});
