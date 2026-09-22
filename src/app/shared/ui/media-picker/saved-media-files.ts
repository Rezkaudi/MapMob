import { MediaFile } from './media-file';

/** Files already on the server, as the picker shows them when a form edits. */
export function toSavedMediaFiles(urls: readonly string[]): MediaFile[] {
  return urls.filter(Boolean).map((url) => ({
    id: url,
    name: url.split('/').at(-1) ?? url,
    sizeInBytes: 0,
    file: null,
    previewUrl: url,
  }));
}
