import { StoryDraft } from '../models/story-draft';

/** Multipart, so the file travels with the text. An edit that keeps its file sends none. */
export function toStoryFormData(draft: StoryDraft): FormData {
  const data = new FormData();
  if (draft.file) {
    data.set('file', draft.file);
  }
  if (draft.caption) {
    data.set('caption', draft.caption);
  }
  return data;
}
