import { buildStorySummary } from '../testing/story-fixture';
import { buildStoryStatCards } from './story-stat-cards';

describe('buildStoryStatCards', () => {
  it('lists the four cards from the right: all, active, expired, views', () => {
    expect(buildStoryStatCards(buildStorySummary())).toEqual([
      { label: 'إجمالي القصص', value: '124', icon: 'story-stack' },
      { label: 'القصص النشطة', value: '10', icon: 'check-circle-feather' },
      { label: 'القصص المنتهية', value: '21', icon: 'clock-feather' },
      { label: 'إجمالي المشاهدات', value: '1,200', icon: 'eye-rounded' },
    ]);
  });

  it('shows zeros until the summary arrives', () => {
    expect(buildStoryStatCards(null).map((card) => card.value)).toEqual(['0', '0', '0', '0']);
  });
});
