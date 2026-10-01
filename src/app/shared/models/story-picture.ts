import { StoryMediaKind } from './story-media-kind';

/** The file of one story and the short text drawn over it. */
export interface StoryPicture {
  readonly kind: StoryMediaKind;
  readonly url: string;
  /** Still frame of a video; null for pictures and for videos the server has no frame of yet. */
  readonly posterUrl: string | null;
  readonly caption: string | null;
}
