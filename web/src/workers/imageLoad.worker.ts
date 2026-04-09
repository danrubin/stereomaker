self.onmessage = async (e: MessageEvent<File>) => {
  const bitmap = await createImageBitmap(e.data);
  // Transfer ownership of the bitmap to the main thread (zero-copy)
  self.postMessage({ bitmap }, [bitmap]);
};
