import { StoryVisibilityAction } from '../../../shared/models/story-visibility-action';
import { StoryEntry } from './story-entry';

/** What one row of the table shows. */
export interface StoryRow {
  readonly story: StoryEntry;
  /** The picture, or the still frame of a video; null when the server has no frame yet. */
  readonly thumbnailUrl: string | null;
  readonly statusLabel: string;
  /** Tailwind background of the status pill. */
  readonly pillClass: string;
  /** "1,240". */
  readonly viewsText: string;
  /** null once the story has run out: there is nothing left to hide or show. */
  readonly visibilityAction: StoryVisibilityAction | null;
}
