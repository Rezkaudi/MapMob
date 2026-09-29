import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { ListQuery } from '../../../shared/models/list-query';
import { DeliveryPlatformRepository } from '../data/delivery-platform.repository';
import { DeliveryPlatformPage } from '../models/delivery-platform-page';
import {
  buildDeliveryPlatform,
  buildDeliveryPlatformDraft,
  buildDeliveryPlatformSummary,
} from '../testing/delivery-platform-fixture';
import { DeliveryPlatformsStore } from './delivery-platforms.store';

const TALABAT = buildDeliveryPlatform();
const PAGE: DeliveryPlatformPage = { items: [TALABAT], totalCount: 9 };

function createStore(overrides: Partial<DeliveryPlatformRepository> = {}) {
  const queries: ListQuery[] = [];
  const repository: Partial<DeliveryPlatformRepository> = {
    getPlatforms: (query) => {
      queries.push(query);
      return of(PAGE);
    },
    getSummary: vi.fn(() => of(buildDeliveryPlatformSummary())),
    createPlatform: vi.fn(() => of(TALABAT)),
    updatePlatform: vi.fn(() => of(TALABAT)),
    setPlatformStatus: vi.fn(() => of(TALABAT)),
    deletePlatform: vi.fn((): Observable<void> => of(undefined)),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      DeliveryPlatformsStore,
      { provide: DeliveryPlatformRepository, useValue: repository },
    ],
  });
  return { store: TestBed.inject(DeliveryPlatformsStore), queries, repository };
}

describe('DeliveryPlatformsStore', () => {
  it('loads four platforms a page, as the frame draws them', () => {
    const { store, queries } = createStore();

    store.loadPlatforms();

    expect(queries).toEqual([{ pageIndex: 0, pageSize: 4 }]);
    expect(store.entries()).toEqual([TALABAT]);
    expect(store.totalCount()).toBe(9);
  });

  it('keeps the error when the page cannot load', () => {
    const { store } = createStore({
      getPlatforms: () => throwError(() => new Error('تعذر التحميل')),
    });

    store.loadPlatforms();

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('turns the summary into the four cards', () => {
    const { store } = createStore();

    expect(store.statCards().map((card) => card.value)).toEqual(['0', '—', '0', '0']);
    store.loadSummary();

    expect(store.statCards().map((card) => card.value)).toEqual(['400', 'talabat', '300', '6']);
  });

  it('suggests the next free display position once the summary is in', () => {
    const { store } = createStore();

    expect(store.nextSortOrder()).toBe(1);
    store.loadSummary();

    expect(store.nextSortOrder()).toBe(8);
  });

  it('searches and sorts from the first page', () => {
    const { store, queries } = createStore();
    store.changePage(2);

    store.setSearch(' طلبات ');
    store.setSort('newest');

    expect(queries.at(-2)).toEqual({ pageIndex: 0, pageSize: 4, search: 'طلبات' });
    expect(queries.at(-1)).toEqual({ pageIndex: 0, pageSize: 4, search: 'طلبات', sort: 'newest' });
  });

  it('words the empty table by whether a search is on', () => {
    const { store } = createStore();

    expect(store.emptyMessage()).toBe('لا توجد منصات مضافة حتى الآن');
    store.setSearch('xyz');
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة لبحثك');
  });

  it('reloads the table and the cards after each save', async () => {
    const { store, queries, repository } = createStore();
    const draft = buildDeliveryPlatformDraft();

    expect(await store.createPlatform(draft)).toBe(true);
    await store.updatePlatform('platform-1', draft);
    await store.changeStatus('platform-1', 'suspended');
    await store.deletePlatform('platform-1');

    expect(repository.createPlatform).toHaveBeenCalledWith(draft);
    expect(repository.updatePlatform).toHaveBeenCalledWith('platform-1', draft);
    expect(repository.setPlatformStatus).toHaveBeenCalledWith('platform-1', 'suspended');
    expect(repository.deletePlatform).toHaveBeenCalledWith('platform-1');
    expect(queries).toHaveLength(4);
    expect(repository.getSummary).toHaveBeenCalledTimes(4);
  });

  it('keeps the reason a save was refused', async () => {
    const { store } = createStore({
      createPlatform: () => throwError(() => new Error('توجد منصة بهذا الاسم مسبقاً')),
    });

    expect(await store.createPlatform(buildDeliveryPlatformDraft())).toBe(false);
    expect(store.saveError()).toBe('توجد منصة بهذا الاسم مسبقاً');
  });
});
