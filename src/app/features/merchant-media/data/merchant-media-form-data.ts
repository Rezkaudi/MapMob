import { MediaDraft } from '../models/media-draft';
import { mediaKindOfFile } from '../../../shared/data/media-kind-of-file';

/** Multipart, so the file travels with its kind. */
export function toNewMediaFormData(draft: MediaDraft): FormData {
  const data = new FormData();
  data.set('type', draft.kind);
  data.set('file', draft.file);
  return data;
}

/** POST with `_method=PUT`, as PHP reads no multipart body on a real PUT. */
export function toMediaReplaceFormData(file: File): FormData {
  const data = new FormData();
  data.set('_method', 'PUT');
  data.set('type', mediaKindOfFile(file));
  data.set('file', file);
  return data;
}
