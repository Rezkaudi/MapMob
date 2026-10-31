import { MediaKind } from '../models/media-kind';

const MIME_BY_EXTENSION: Readonly<Record<string, string>> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  mp4: 'video/mp4',
  mov: 'video/quicktime',
  webm: 'video/webm',
};

const FALLBACK_MIME: Readonly<Record<MediaKind, string>> = {
  image: 'image/jpeg',
  video: 'video/mp4',
};

/** The card prints "JPG"; the server sends no type, so it is read from the file name. */
export function mimeTypeOfUrl(url: string, kind: MediaKind): string {
  const extension = url.split('?')[0].split('.').pop()?.toLowerCase() ?? '';
  return MIME_BY_EXTENSION[extension] ?? FALLBACK_MIME[kind];
}
