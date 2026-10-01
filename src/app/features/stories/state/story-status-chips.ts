import { STORY_STATUS_LABELS, StoryStatus } from '../../../shared/models/story-status';
import { ChipOption } from '../../../shared/ui/filter-chips/chip-option';
import { StorySummary } from '../models/story-summary';

export const ALL_STORIES_CHIP = 'all';
const ALL_STORIES_LABEL = 'الكل';

/** The frame's dots: green, amber and a dark red for the stories that ran out. */
const STATUS_DOTS: Record<StoryStatus, string> = {
  active: 'bg-status-success',
  hidden: 'bg-accent',
  expired: 'bg-[#b42318]',
};

const CHIP_STATUSES: readonly StoryStatus[] = ['active', 'hidden', 'expired'];

function countOf(summary: StorySummary | null, status: StoryStatus): number {
  if (!summary) {
    return 0;
  }
  const counts: Record<StoryStatus, number> = {
    active: summary.activeCount,
    hidden: summary.hiddenCount,
    expired: summary.expiredCount,
  };
  return counts[status];
}

/** RTL puts the first chip on the right, so "الكل" leads. */
export function buildStoryStatusChips(summary: StorySummary | null): readonly ChipOption[] {
  return [
    { value: ALL_STORIES_CHIP, label: ALL_STORIES_LABEL, count: summary?.storyCount ?? 0 },
    ...CHIP_STATUSES.map((status) => ({
      value: status,
      label: STORY_STATUS_LABELS[status],
      count: countOf(summary, status),
      dotClass: STATUS_DOTS[status],
    })),
  ];
}
