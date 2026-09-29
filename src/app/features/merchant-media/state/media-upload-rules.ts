import { PICTURE_RULES } from '../../../shared/files/picture-rules';
import { VIDEO_RULES } from '../../../shared/files/video-rules';
import { FileRules } from '../../../shared/ui/media-picker/file-rules';
import { MediaKind } from '../models/media-kind';

export const MEDIA_UPLOAD_RULES: Record<MediaKind, FileRules> = {
  image: PICTURE_RULES,
  video: VIDEO_RULES,
};

/** For a file input's `accept`. */
export function acceptedTypesOf(kind: MediaKind): string {
  return MEDIA_UPLOAD_RULES[kind].accepted.join(',');
}
