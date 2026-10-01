import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { MerchantStoriesRepository } from '../data/merchant-stories.repository';
import { MerchantStory } from '../models/merchant-story';
import { MerchantStoryLibrary } from '../models/merchant-story-library';
import { StoryDraft } from '../models/story-draft';
import {
  STORY_NOW,
  buildExpiredStory,
  buildStory,
  buildStoryLibrary,
} from '../testing/merchant-story-fixture';
import { MerchantStoriesStore } from './merchant-stories.store';

const at = (day: number, hour: number) => new Date(2026, 9, day, hour, 30).toISOString();
const MORNING = buildStory({ id: 'morning', publishedAt: at(1, 10), expiresAt: at(2, 10) });
const EVENING = buildStory({ id: 'evening', publishedAt: at(1, 18), expiresAt: at(2, 18) });
const EXPIRED = buildExpiredStory({ id: 'expired' });
const PICTURE = new File(['x'], 'serum.jpg', { type: 'image/jpeg' });

class FakeRepository extends MerchantStoriesRepository {
  library: MerchantStoryLibrary = buildStoryLibrary({ items: [MORNING, EXPIRED, EVENING] });
  failure: Error | null = null;
  added: StoryDraft[] = [];
  updated: [string, StoryDraft][] = [];
  deleted: string[] = [];

  getLibrary(): Observable<MerchantStoryLibrary> {
    return this.answer(this.library);
  }
  addStory(draft: StoryDraft): Observable<MerchantStory> {
    this.added.push(draft);
    return this.answer(
      buildStory({
        id: 'new',
        caption: draft.caption,
        publishedAt: at(1, 20),
        expiresAt: at(2, 20),
      }),
    );
  }
  updateStory(id: string, draft: StoryDraft): Observable<MerchantStory> {
    this.updated.push([id, draft]);
    return this.answer({ ...MORNING, id, caption: draft.caption });
  }
  deleteStory(id: string): Observable<void> {
    this.deleted.push(id);
    return this.answer(undefined);
  }
  private answer<T>(value: T): Observable<T> {
    return this.failure ? throwError(() => this.failure) : of(value);
  }
}

function setUp(configure: (repository: FakeRepository) => void = () => undefined) {
  const repository = new FakeRepository();
  configure(repository);
  TestBed.configureTestingModule({
    providers: [
      MerchantStoriesStore,
      { provide: MerchantStoriesRepository, useValue: repository },
      { provide: CLOCK, useValue: () => STORY_NOW },
    ],
  });
  const store = TestBed.inject(MerchantStoriesStore);
  store.load();
  return { store, repository };
}

type Store = InstanceType<typeof MerchantStoriesStore>;
const activeIds = (store: Store) => store.activeCards().map((card) => card.story.id);
const expiredIds = (store: Store) => store.expiredCards().map((card) => card.story.id);

describe('MerchantStoriesStore', () => {
  it('loads the two lists, the tiles and the quota', () => {
    const { store } = setUp();

    expect(activeIds(store)).toEqual(['evening', 'morning']);
    expect(expiredIds(store)).toEqual(['expired']);
    expect(store.activeCards()[1].remainingText).toBe('متبقي 14 ساعة');
    expect(store.countTiles().map((tile) => tile.count)).toEqual([2, 1]);
    expect(store.planName()).toBe('الباقة المجانية');
    expect(store.quota()?.limitText).toBe('/ 5 قصص مستخدمة');
    expect(store.limitText()).toBe('الحد المسموح 5 قصص');
    expect(store.hasNoStories()).toBe(false);
    expect(store.isFull()).toBe(false);
  });

  it('keeps the load error for the page to show', () => {
    const { store } = setUp((repository) => (repository.failure = new Error('انقطع الاتصال')));

    expect(store.error()).toBe('انقطع الاتصال');
  });

  it('says the page is empty only when the place never posted a story', () => {
    const { store } = setUp((fake) => (fake.library = { ...fake.library, items: [] }));

    expect(store.hasNoStories()).toBe(true);
  });

  it('opens the add dialog with the plan line', () => {
    const { store } = setUp();

    store.openAdd();

    expect(store.formDialog()).toEqual({
      story: null,
      notice: 'متبقي لديك 3 قصص ضمن الباقة المجانية (الحد المسموح 5 قصص)',
    });
  });

  it('does not open the add dialog when the plan is full', () => {
    const { store } = setUp((fake) => (fake.library = { ...fake.library, activeStoryLimit: 2 }));

    expect(store.isFull()).toBe(true);
    store.openAdd();
    expect(store.formDialog()).toBeNull();
  });

  it('publishes a story, puts it first and closes the dialog', async () => {
    const { store, repository } = setUp();
    store.openAdd();

    await store.submitDraft({ file: PICTURE, caption: 'نص' });

    expect(repository.added).toEqual([{ file: PICTURE, caption: 'نص' }]);
    expect(store.formDialog()).toBeNull();
    expect(activeIds(store)).toEqual(['new', 'evening', 'morning']);
    expect(store.quota()?.usedCount).toBe(3);
  });

  it('keeps the dialog open with the error when publishing fails', async () => {
    const { store, repository } = setUp();
    store.openAdd();
    repository.failure = new Error('الملف كبير');

    await store.submitDraft({ file: PICTURE, caption: null });

    expect(store.formDialog()).not.toBeNull();
    expect(store.saveError()).toBe('الملف كبير');
  });

  it('opens the edit dialog on an active story and saves the change', async () => {
    const { store, repository } = setUp();

    store.openEdit(MORNING);
    expect(store.formDialog()).toEqual({ story: MORNING, notice: null });
    await store.submitDraft({ file: null, caption: 'نص جديد' });

    expect(repository.updated).toEqual([['morning', { file: null, caption: 'نص جديد' }]]);
    expect(repository.added).toEqual([]);
    expect(store.formDialog()).toBeNull();
    expect(store.activeCards()[1].story.caption).toBe('نص جديد');
  });

  it('does not open the edit dialog on an expired story', () => {
    const { store } = setUp();

    store.openEdit(EXPIRED);

    expect(store.formDialog()).toBeNull();
  });

  it('shows one story in the drawer with the place name', () => {
    const { store } = setUp();

    store.openView(MORNING);

    expect(store.detail()?.placeName).toBe('صيدلية الشفاء');
    expect(store.detail()?.card.story.id).toBe('morning');
    store.closeDialog();
    expect(store.detail()).toBeNull();
  });

  it('asks before deleting, from a card or from the drawer, then removes the story', async () => {
    const { store, repository } = setUp();
    store.openView(EXPIRED);

    store.openDelete(EXPIRED);
    expect(store.detail()).toBeNull();
    expect(store.deleteCopy()?.context?.lines[0]).toBe('صيدلية الشفاء • قصة 18 سبتمبر');
    await store.confirmDelete();

    expect(repository.deleted).toEqual(['expired']);
    expect(store.deleteCopy()).toBeNull();
    expect(expiredIds(store)).toEqual([]);
  });

  it('keeps the delete question open with the error when deleting fails', async () => {
    const { store, repository } = setUp();
    store.openDelete(MORNING);
    repository.failure = new Error('تعذر الحذف');

    await store.confirmDelete();

    expect(store.deleteCopy()).not.toBeNull();
    expect(store.saveError()).toBe('تعذر الحذف');
    expect(activeIds(store)).toEqual(['evening', 'morning']);
  });
});
