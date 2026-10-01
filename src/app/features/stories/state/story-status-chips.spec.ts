import { buildStorySummary } from '../testing/story-fixture';
import { ALL_STORIES_CHIP, buildStoryStatusChips } from './story-status-chips';

describe('buildStoryStatusChips', () => {
  it('lists every story first, then each status with its dot and count', () => {
    expect(buildStoryStatusChips(buildStorySummary())).toEqual([
      { value: ALL_STORIES_CHIP, label: 'الكل', count: 124 },
      { value: 'active', label: 'نشطة', count: 10, dotClass: 'bg-status-success' },
      { value: 'hidden', label: 'مخفية', count: 1, dotClass: 'bg-accent' },
      { value: 'expired', label: 'منتهية', count: 21, dotClass: 'bg-[#b42318]' },
    ]);
  });

  it('counts nothing until the summary arrives', () => {
    expect(buildStoryStatusChips(null).map((chip) => chip.count)).toEqual([0, 0, 0, 0]);
  });
});
