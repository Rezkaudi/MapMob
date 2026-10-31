import { mediaKindOfFile } from '../../../shared/data/media-kind-of-file';
import { StoryDraft } from '../models/story-draft';

const CLEARED_CAPTION = '';

/** Multipart, so the file travels with the text. */
export function toNewStoryFormData(draft: StoryDraft): FormData {
  const data = new FormData();
  appendFile(data, draft.file);
  if (draft.caption) {
    data.set('caption', draft.caption);
  }
  return data;
}

/** POST with `_method=PUT`; an edit that keeps its file sends none, and an empty text clears it. */
export function toStoryUpdateFormData(draft: StoryDraft): FormData {
  const data = new FormData();
  data.set('_method', 'PUT');
  appendFile(data, draft.file);
  data.set('caption', draft.caption ?? CLEARED_CAPTION);
  return data;
}

function appendFile(data: FormData, file: File | null): void {
  if (file) {
    data.set('type', mediaKindOfFile(file));
    data.set('file', file);
  }
}
