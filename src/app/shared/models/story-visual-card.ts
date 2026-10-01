import { StoryPicture } from './story-picture';
import { StoryStatus } from './story-status';

/** What the 9:16 story picture shows over the file. */
export interface StoryVisualCard {
  readonly story: StoryPicture & { readonly status: StoryStatus };
  readonly statusLabel: string;
  /** "متبقي 14 ساعة"; null unless the story is still showing. */
  readonly remainingText: string | null;
}
