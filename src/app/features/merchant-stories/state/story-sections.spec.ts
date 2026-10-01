import { buildExpiredStory, buildStory } from '../testing/merchant-story-fixture';
import { splitStories } from './story-sections';

const moment = (day: number, hour: number) => new Date(2026, 9, day, hour, 0).toISOString();

describe('splitStories', () => {
  it('sorts the active stories by the newest post and the expired ones by the latest end', () => {
    const sections = splitStories([
      buildStory({ id: 'old-active', publishedAt: moment(1, 8) }),
      buildExpiredStory({ id: 'old-expired', expiresAt: moment(1, 9) }),
      buildStory({ id: 'new-active', publishedAt: moment(1, 18) }),
      buildExpiredStory({ id: 'new-expired', expiresAt: moment(1, 19) }),
    ]);

    expect(sections.active.map((story) => story.id)).toEqual(['new-active', 'old-active']);
    expect(sections.expired.map((story) => story.id)).toEqual(['new-expired', 'old-expired']);
  });
});
