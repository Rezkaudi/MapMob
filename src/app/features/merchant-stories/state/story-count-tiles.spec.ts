import { buildExpiredStory, buildStory } from '../testing/merchant-story-fixture';
import { countStories } from './story-count-tiles';

describe('countStories', () => {
  it('counts the active stories first, so RTL puts them on the right as the frame does', () => {
    const items = [buildStory({ id: '1' }), buildStory({ id: '2' }), buildExpiredStory()];

    expect(countStories(items)).toEqual([
      { key: 'active', label: 'قصة نشطة', count: 2, icon: 'media', tone: 'primary' },
      { key: 'expired', label: 'قصة منتهية', count: 1, icon: 'video', tone: 'accent' },
    ]);
  });
});
