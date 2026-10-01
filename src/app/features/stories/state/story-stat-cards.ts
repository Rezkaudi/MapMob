import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { StoryStatCard } from '../models/story-stat-card';
import { StorySummary } from '../models/story-summary';

/** RTL puts the first card on the right, so the total leads. */
export function buildStoryStatCards(summary: StorySummary | null): readonly StoryStatCard[] {
  return [
    {
      label: 'إجمالي القصص',
      value: formatGroupedNumber(summary?.storyCount ?? 0),
      icon: 'story-stack',
    },
    {
      label: 'القصص النشطة',
      value: formatGroupedNumber(summary?.activeCount ?? 0),
      icon: 'check-circle-feather',
    },
    {
      label: 'القصص المنتهية',
      value: formatGroupedNumber(summary?.expiredCount ?? 0),
      icon: 'clock-feather',
    },
    {
      label: 'إجمالي المشاهدات',
      value: formatGroupedNumber(summary?.viewCount ?? 0),
      icon: 'eye-rounded',
    },
  ];
}
