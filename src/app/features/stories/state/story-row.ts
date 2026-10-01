import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { STORY_STATUS_LABELS, StoryStatus } from '../../../shared/models/story-status';
import { thumbnailOf } from '../../../shared/state/story-thumbnail';
import { StoryEntry } from '../models/story-entry';
import { StoryRow } from '../models/story-row';
import { visibilityActionFor } from './story-visibility';

const PILL_CLASSES: Record<StoryStatus, string> = {
  active: 'bg-status-success',
  hidden: 'bg-accent',
  expired: 'bg-[#94a3b8]',
};

export function toStoryRow(story: StoryEntry): StoryRow {
  return {
    story,
    thumbnailUrl: thumbnailOf(story),
    statusLabel: STORY_STATUS_LABELS[story.status],
    pillClass: PILL_CLASSES[story.status],
    viewsText: formatGroupedNumber(story.viewCount),
    visibilityAction: visibilityActionFor(story.status),
  };
}
