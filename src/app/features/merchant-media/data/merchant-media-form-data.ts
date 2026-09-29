import { MediaDraft } from '../models/media-draft';

/** Multipart, so the file travels with the fields. */
export function toNewMediaFormData(draft: MediaDraft): FormData {
  const data = new FormData();
  data.set('kind', draft.kind);
  data.set('file', draft.file);
  data.set('isMain', String(draft.isMain));
  return data;
}

export function toMediaReplaceFormData(file: File): FormData {
  const data = new FormData();
  data.set('file', file);
  return data;
}
