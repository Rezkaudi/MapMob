import { PICTURE_RULES } from '../../../shared/files/picture-rules';
import { VIDEO_RULES } from '../../../shared/files/video-rules';
import { findFileError } from '../../../shared/ui/media-picker/file-rules';
import { StoryMediaKind } from '../models/story-media-kind';

const VIDEO_TYPE_PREFIX = 'video/';
const TYPE_MESSAGE = 'يُسمح بصور JPG و PNG وملفات الفيديو فقط';

/** For the file input's `accept`. */
export const STORY_ACCEPTED_TYPES = [...PICTURE_RULES.accepted, ...VIDEO_RULES.accepted].join(',');

export function storyKindOf(file: File): StoryMediaKind {
  return file.type.startsWith(VIDEO_TYPE_PREFIX) ? 'video' : 'image';
}

/** A story takes one picture or one video; each kind keeps its own size limit. */
export function findStoryFileError(file: File): string | null {
  const rules = storyKindOf(file) === 'video' ? VIDEO_RULES : PICTURE_RULES;
  return findFileError(file, { ...rules, typeMessage: TYPE_MESSAGE });
}
