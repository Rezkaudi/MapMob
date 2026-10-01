import { StoryEntry } from './story-entry';
import { StoryOverlayKind } from './story-overlay-kind';

/** What is open over the table, and when it opened: the time left is counted from then. */
export interface StoryOverlay {
  readonly kind: StoryOverlayKind;
  readonly story: StoryEntry;
  readonly openedAt: Date;
}
