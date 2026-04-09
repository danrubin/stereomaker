self.onmessage = async (e: MessageEvent<File>) => {
  try {
    const bitmap = await createImageBitmap(e.data);
    // Transfer ownership zero-copy
    self.postMessage({ bitmap }, [bitmap]);
  } catch (err) {
    self.postMessage({ error: String(err) });
  }
};
