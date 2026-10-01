import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { STORY_NOW } from '../testing/story-fixture';
import { StoryMockRepository } from './story-mock.repository';

function createRepository(): StoryMockRepository {
  TestBed.configureTestingModule({
    providers: [StoryMockRepository, { provide: CLOCK, useValue: () => STORY_NOW }],
  });
  return TestBed.inject(StoryMockRepository);
}

describe('StoryMockRepository', () => {
  it('serves the seeded stories four a page, with numbers that add up', async () => {
    const repository = createRepository();

    const page = await firstValueFrom(repository.getStories({ pageIndex: 0, pageSize: 4 }));
    const summary = await firstValueFrom(repository.getSummary());

    expect(page.items).toHaveLength(4);
    expect(page.totalCount).toBe(summary.storyCount);
    expect(summary.activeCount + summary.hiddenCount + summary.expiredCount).toBe(
      summary.storyCount,
    );
    expect(summary.hiddenCount).toBeGreaterThan(0);
  });

  it('keeps a hidden story hidden between calls', async () => {
    const repository = createRepository();
    const [first] = (
      await firstValueFrom(repository.getStories({ pageIndex: 0, pageSize: 1, status: 'active' }))
    ).items;

    await firstValueFrom(repository.setStoryHidden(first.id, true));
    const hidden = await firstValueFrom(
      repository.getStories({ pageIndex: 0, pageSize: 50, status: 'hidden' }),
    );

    expect(hidden.items.map((story) => story.id)).toContain(first.id);
  });

  it('turns a refused change into an error event', async () => {
    const repository = createRepository();
    const [expired] = (
      await firstValueFrom(repository.getStories({ pageIndex: 0, pageSize: 1, status: 'expired' }))
    ).items;

    await expect(firstValueFrom(repository.setStoryHidden(expired.id, true))).rejects.toThrow(
      'انتهت هذه القصة ولا يمكن تغيير ظهورها.',
    );
  });

  it('exports a CSV file and forgets a deleted story', async () => {
    const repository = createRepository();
    const query = { pageIndex: 0, pageSize: 4 };
    const before = await firstValueFrom(repository.getStories(query));

    const file = await firstValueFrom(repository.exportStories({ query, ids: [] }));
    await firstValueFrom(repository.deleteStory(before.items[0].id), { defaultValue: undefined });
    const after = await firstValueFrom(repository.getStories(query));

    expect(file.type).toContain('text/csv');
    expect(after.totalCount).toBe(before.totalCount - 1);
  });
});
