/** What the story dialog sends. `file` is null when an edit keeps the saved picture or video. */
export interface StoryDraft {
  readonly file: File | null;
  readonly caption: string | null;
}
