/** Decodes a File to an ImageBitmap via a Web Worker (off main thread, per CLAUDE.md). */
export function loadImageFile(file: File): Promise<ImageBitmap> {
  return new Promise<ImageBitmap>((resolve, reject) => {
    const worker = new Worker(
      new URL('../workers/imageLoad.worker.ts', import.meta.url),
      { type: 'module' },
    );
    worker.onmessage = (e: MessageEvent<{ bitmap: ImageBitmap } | { error: string }>) => {
      if ('error' in e.data) {
        reject(new Error(e.data.error));
      } else {
        resolve(e.data.bitmap);
      }
      worker.terminate();
    };
    worker.onerror = (e: ErrorEvent) => {
      reject(e);
      worker.terminate();
    };
    worker.postMessage(file);
  });
}
