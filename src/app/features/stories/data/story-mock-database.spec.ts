import { STORY_NOW } from '../testing/story-fixture';
import { StoryMockDatabase } from './story-mock-database';
import { SeedStory } from './story-mock-seed';

const HOUR_MS = 3_600_000;

function seedStory(id: string, overrides: Partial<SeedStory> = {}): SeedStory {
  return {
    id,
    place: { id: 'place-1', name: 'صيدلية الشفاء' },
    kind: 'image',
    url: `assets/images/${id}.jpg`,
    posterUrl: null,
    caption: null,
    publishedAt: new Date(STORY_NOW.getTime() - 2 * HOUR_MS).toISOString(),
    expiresAt: new Date(STORY_NOW.getTime() + 22 * HOUR_MS).toISOString(),
    viewCount: 100,
    isHidden: false,
    ...overrides,
  };
}

const EXPIRED = {
  publishedAt: new Date(STORY_NOW.getTime() - 50 * HOUR_MS).toISOString(),
  expiresAt: new Date(STORY_NOW.getTime() - 26 * HOUR_MS).toISOString(),
};

function createDatabase() {
  return new StoryMockDatabase(
    [
      seedStory('older', {
        publishedAt: new Date(STORY_NOW.getTime() - 5 * HOUR_MS).toISOString(),
      }),
      seedStory('newest', { place: { id: 'place-4', name: 'كافيه ورد' }, viewCount: 40 }),
      seedStory('hidden', { isHidden: true, viewCount: 10 }),
      seedStory('expired', { ...EXPIRED, viewCount: 50 }),
      seedStory('hidden-then-expired', { ...EXPIRED, isHidden: true, viewCount: 0 }),
    ],
    () => STORY_NOW,
  );
}

const idsOf = (database: StoryMockDatabase, query = {}) =>
  database.page({ pageIndex: 0, pageSize: 10, ...query }).items.map((story) => story.id);

describe('StoryMockDatabase', () => {
  it('reads the status from the clock first, then from the hidden mark', () => {
    const statuses = createDatabase()
      .page({ pageIndex: 0, pageSize: 10 })
      .items.map((story) => [story.id, story.status]);

    expect(statuses).toEqual([
      ['newest', 'active'],
      ['hidden', 'hidden'],
      ['older', 'active'],
      ['expired', 'expired'],
      ['hidden-then-expired', 'expired'],
    ]);
  });

  it('pages the stories, newest first', () => {
    const page = createDatabase().page({ pageIndex: 1, pageSize: 2 });

    expect(page.totalCount).toBe(5);
    expect(page.items.map((story) => story.id)).toEqual(['older', 'expired']);
  });

  it('filters by status and searches the place name', () => {
    const database = createDatabase();

    expect(idsOf(database, { status: 'hidden' })).toEqual(['hidden']);
    expect(idsOf(database, { status: 'expired' })).toEqual(['expired', 'hidden-then-expired']);
    expect(idsOf(database, { search: 'كافيه' })).toEqual(['newest']);
  });

  it('counts every story for the cards and the chips', () => {
    expect(createDatabase().summary()).toEqual({
      storyCount: 5,
      activeCount: 2,
      hiddenCount: 1,
      expiredCount: 2,
      viewCount: 200,
    });
  });

  it('hides a running story and shows it again', () => {
    const database = createDatabase();

    expect(database.setHidden('newest', true).status).toBe('hidden');
    expect(database.summary().hiddenCount).toBe(2);
    expect(database.setHidden('newest', false).status).toBe('active');
  });

  it('refuses to hide or show a story that has run out', () => {
    expect(() => createDatabase().setHidden('expired', true)).toThrow(
      'انتهت هذه القصة ولا يمكن تغيير ظهورها.',
    );
  });

  it('forgets a deleted story and refuses an unknown one', () => {
    const database = createDatabase();

    database.remove('hidden');

    expect(idsOf(database)).not.toContain('hidden');
    expect(() => database.remove('hidden')).toThrow('لم تعد هذه القصة موجودة.');
  });

  it('exports the ticked rows, or every story the filters match', () => {
    const database = createDatabase();
    const query = { pageIndex: 0, pageSize: 2, status: 'active' as const };

    expect(database.exported({ query, ids: [] }).map((story) => story.id)).toEqual([
      'newest',
      'older',
    ]);
    expect(database.exported({ query, ids: ['expired'] }).map((story) => story.id)).toEqual([
      'expired',
    ]);
  });
});
