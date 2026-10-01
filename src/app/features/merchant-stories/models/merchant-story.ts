import { StoryMediaKind } from './story-media-kind';
import { StoryStatus } from './story-status';

/** One story of the place: a picture or video the app shows for 24 hours. */
export interface MerchantStory {
  readonly id: string;
  readonly kind: StoryMediaKind;
  readonly url: string;
  /** Still frame of a video; null for pictures and for videos the server has no frame of yet. */
  readonly posterUrl: string | null;
  /** The short text drawn over the story; null when the owner wrote none. */
  readonly caption: string | null;
  readonly status: StoryStatus;
  /** ISO moment. */
  readonly publishedAt: string;
  /** ISO moment, 24 hours after `publishedAt`. */
  readonly expiresAt: string;
  readonly viewCount: number;
}
