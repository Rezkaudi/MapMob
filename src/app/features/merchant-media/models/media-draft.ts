import { MediaKind } from './media-kind';

/** What the "إضافة وسائط" dialog sends. */
export interface MediaDraft {
  readonly kind: MediaKind;
  readonly file: File;
  /** Pictures only; always false for a video. */
  readonly isMain: boolean;
}
