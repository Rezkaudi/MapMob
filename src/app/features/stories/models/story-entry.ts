import { NamedReference } from '../../../shared/models/named-reference';
import { StoryPicture } from '../../../shared/models/story-picture';
import { StoryStatus } from '../../../shared/models/story-status';

/** One story of any place, as a row of the admin table. */
export interface StoryEntry extends StoryPicture {
  readonly id: string;
  readonly place: NamedReference;
  readonly status: StoryStatus;
  /** ISO moment. */
  readonly publishedAt: string;
  /** ISO moment, 24 hours after `publishedAt`. */
  readonly expiresAt: string;
  readonly viewCount: number;
}
