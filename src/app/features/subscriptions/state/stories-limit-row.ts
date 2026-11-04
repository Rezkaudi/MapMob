import {
  LAST_PLURAL_COUNT,
  PlanLimitRow,
  UNLIMITED_LABEL,
} from '../../../shared/state/plan-limit-rows';

function formatStories(count: number): string {
  if (count === 1) {
    return 'قصة واحدة';
  }
  if (count === 2) {
    return 'قصتان';
  }
  return `${count} ${count <= LAST_PLURAL_COUNT ? 'قصص' : 'قصة'}`;
}

export function buildStoriesLimitRow(limit: number | null): PlanLimitRow {
  return {
    label: 'القصص النشطة:',
    value: limit === null ? UNLIMITED_LABEL : formatStories(limit),
  };
}
