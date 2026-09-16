import { UploadedImage } from './uploaded-image';

/** A file already on the server, as the upload field shows it when a form edits. */
export function toUploadedImage(url: string | null): UploadedImage | null {
  if (!url) {
    return null;
  }
  return {
    file: null,
    name: url.split('/').at(-1) ?? url,
    previewUrl: url,
    sizeInBytes: null,
    width: null,
    height: null,
  };
}
