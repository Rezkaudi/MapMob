export interface ImageSize {
  readonly width: number;
  readonly height: number;
}

/** Loads the picture behind `url` to read its pixel size, or `null` when it cannot be read. */
export function readImageSize(url: string): Promise<ImageSize | null> {
  return new Promise((resolve) => {
    const image = new Image();
    image.onload = () => resolve({ width: image.naturalWidth, height: image.naturalHeight });
    image.onerror = () => resolve(null);
    image.src = url;
  });
}
