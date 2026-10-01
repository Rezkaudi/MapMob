import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { StoryRepository } from '../data/story.repository';
import { StoryExportRequest } from '../models/story-export-request';
import { StoryPage } from '../models/story-page';
import { StoryQuery } from '../models/story-query';
import {
  STORY_NOW,
  buildExpiredStoryEntry,
  buildHiddenStoryEntry,
  buildStoryEntry,
  buildStorySummary,
} from '../testing/story-fixture';
import { StoriesStore } from './stories.store';

const ACTIVE = buildStoryEntry();
const HIDDEN = buildHiddenStoryEntry();
const PAGE: StoryPage = { items: [ACTIVE, HIDDEN], totalCount: 9 };
const FILE = new Blob(['csv']);

function createStore(overrides: Partial<StoryRepository> = {}) {
  const queries: StoryQuery[] = [];
  const exports: StoryExportRequest[] = [];
  const repository: Partial<StoryRepository> = {
    getStories: (query) => {
      queries.push(query);
      return of(PAGE);
    },
    getSummary: vi.fn(() => of(buildStorySummary())),
    setStoryHidden: vi.fn(() => of(HIDDEN)),
    deleteStory: vi.fn((): Observable<void> => of(undefined)),
    exportStories: (request) => {
      exports.push(request);
      return of(FILE);
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      StoriesStore,
      { provide: StoryRepository, useValue: repository },
      { provide: CLOCK, useValue: () => STORY_NOW },
    ],
  });
  return { store: TestBed.inject(StoriesStore), queries, exports, repository };
}

describe('StoriesStore', () => {
  it('loads four stories a page, as the frame draws them', () => {
    const { store, queries } = createStore();

    store.loadStories();

    expect(queries).toEqual([{ pageIndex: 0, pageSize: 4 }]);
    expect(store.rows().map((row) => row.story)).toEqual([ACTIVE, HIDDEN]);
    expect(store.totalCount()).toBe(9);
  });

  it('keeps the error when the page cannot load', () => {
    const { store } = createStore({
      getStories: () => throwError(() => new Error('تعذر التحميل')),
    });

    store.loadStories();

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('turns the summary into the four cards and the four chips', () => {
    const { store } = createStore();

    expect(store.statCards().map((card) => card.value)).toEqual(['0', '0', '0', '0']);
    store.loadSummary();

    expect(store.statCards().map((card) => card.value)).toEqual(['124', '10', '21', '1,200']);
    expect(store.statusChips().map((chip) => chip.count)).toEqual([124, 10, 1, 21]);
  });

  it('searches and filters by status from the first page, dropping the ticks', () => {
    const { store, queries } = createStore();
    store.loadStories();
    store.toggleSelected(ACTIVE.id);
    store.changePage(2);

    store.setSearch(' كافيه ');
    store.setStatusFilter('hidden');

    expect(queries.at(-2)).toEqual({ pageIndex: 0, pageSize: 4, search: 'كافيه' });
    expect(queries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 4,
      search: 'كافيه',
      status: 'hidden',
    });
    expect(store.selectedChip()).toBe('hidden');
    expect(store.selectedIds()).toEqual([]);
  });

  it('goes back to every story from the "الكل" chip', () => {
    const { store, queries } = createStore();
    store.setStatusFilter('expired');

    store.setStatusFilter(null);

    expect(queries.at(-1)).toEqual({ pageIndex: 0, pageSize: 4 });
    expect(store.selectedChip()).toBe('all');
  });

  it('words the empty table by what is being looked for', () => {
    const { store } = createStore();

    expect(store.emptyMessage()).toBe('لا توجد قصص منشورة حتى الآن');
    store.setStatusFilter('hidden');
    expect(store.emptyMessage()).toBe('لا توجد قصص بهذه الحالة');
    store.setSearch('xyz');
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة لبحثك');
  });

  it('opens the drawer of a story with the time it has left and a hide button', () => {
    const { store } = createStore();

    store.openOverlay('view', ACTIVE);

    expect(store.detail()?.card.remainingText).toBe('متبقي 14 ساعة');
    expect(store.detail()?.placeName).toBe('صيدلية الشفاء');
    expect(store.drawerAction()).toBe('hide');
    expect(store.confirmCopy()).toBeNull();
  });

  it('offers to show a hidden story from its drawer, and nothing for an expired one', () => {
    const { store } = createStore();

    store.openOverlay('view', HIDDEN);
    expect(store.drawerAction()).toBe('show');

    store.openOverlay('view', buildExpiredStoryEntry());
    expect(store.drawerAction()).toBeNull();
  });

  it('swaps the drawer for the question when hide is picked', () => {
    const { store } = createStore();
    store.openOverlay('view', ACTIVE);

    store.openOverlay('hide', ACTIVE);

    expect(store.detail()).toBeNull();
    expect(store.confirmCopy()?.title).toBe('إخفاء القصة');
  });

  it('hides a story, closes the question and reloads the table and the cards', async () => {
    const { store, queries, repository } = createStore();
    store.openOverlay('hide', ACTIVE);

    await store.confirmOverlay();

    expect(repository.setStoryHidden).toHaveBeenCalledWith(ACTIVE.id, true);
    expect(store.overlay()).toBeNull();
    expect(queries).toHaveLength(1);
    expect(repository.getSummary).toHaveBeenCalledTimes(1);
  });

  it('shows a hidden story again', async () => {
    const { store, repository } = createStore();
    store.openOverlay('show', HIDDEN);

    await store.confirmOverlay();

    expect(repository.setStoryHidden).toHaveBeenCalledWith(HIDDEN.id, false);
  });

  it('deletes a story and unticks it', async () => {
    const { store, repository } = createStore();
    store.loadStories();
    store.toggleSelected(ACTIVE.id);
    store.openOverlay('delete', ACTIVE);

    await store.confirmOverlay();

    expect(repository.deleteStory).toHaveBeenCalledWith(ACTIVE.id);
    expect(store.selectedIds()).toEqual([]);
    expect(store.overlay()).toBeNull();
  });

  it('keeps the question open and says why when a change is refused', async () => {
    const { store } = createStore({
      setStoryHidden: () => throwError(() => new Error('انتهت هذه القصة ولا يمكن تغيير ظهورها.')),
    });
    store.openOverlay('hide', ACTIVE);

    await store.confirmOverlay();

    expect(store.overlay()?.kind).toBe('hide');
    expect(store.saveError()).toBe('انتهت هذه القصة ولا يمكن تغيير ظهورها.');
  });

  it('clears the reason when the question is closed', async () => {
    const { store } = createStore({
      deleteStory: () => throwError(() => new Error('لم تعد هذه القصة موجودة.')),
    });
    store.openOverlay('delete', ACTIVE);
    await store.confirmOverlay();

    store.closeOverlay();

    expect(store.overlay()).toBeNull();
    expect(store.saveError()).toBeNull();
  });

  it('exports what the filters match, or only the ticked rows', async () => {
    const { store, exports } = createStore();
    store.loadStories();
    store.setStatusFilter('active');

    expect(await store.exportStories()).toBe(FILE);
    store.toggleSelected(HIDDEN.id);
    await store.exportStories();

    expect(exports.map((request) => request.ids)).toEqual([[], [HIDDEN.id]]);
    expect(exports[0].query.status).toBe('active');
    expect(store.isExporting()).toBe(false);
  });

  it('says why an export failed instead of saving a file', async () => {
    const { store } = createStore({
      exportStories: () => throwError(() => new Error('تعذر تصدير القصص')),
    });

    expect(await store.exportStories()).toBeNull();
    expect(store.saveError()).toBe('تعذر تصدير القصص');
  });
});
