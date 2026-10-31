import { StoryMediaKind } from '../models/story-media-kind';

const VIDEO_MIME_PREFIX = 'video/';

/** The /owner uploads ask for `type`; it is read from the picked file. */
export function mediaKindOfFile(file: File): StoryMediaKind {
  return file.type.startsWith(VIDEO_MIME_PREFIX) ? 'video' : 'image';
}
