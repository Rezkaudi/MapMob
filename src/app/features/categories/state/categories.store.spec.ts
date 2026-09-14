import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CategoryRepository } from '../data/category.repository';
import { CategoryDraft } from '../models/category-draft';
import { CategoryPage } from '../models/category-page';
import { CategoryQuery } from '../models/category-query';
import { buildCategory } from '../testing/category-fixture';
import { CategoriesStore } from './categories.store';

const RESTAURANTS = buildCategory({ id: 'm1', name: 'مطاعم' });
const DRAFT: CategoryDraft = { name: 'مخابز', kind: 'main', parentId: null, icon: 'store' };
const PAGE: CategoryPage = {
  items: [RESTAURANTS],
  totalCount: 1,
  kindCounts: { all: 21, main: 6, sub: 15 },
};

function createStore(overrides: Partial<CategoryRepository> = {}) {
  const queries: CategoryQuery[] = [];
  const repository: Partial<CategoryRepository> = {
    getCategories: (query) => {
      queries.push(query);
      return of(PAGE);
    },
    getMainCategories: () => of([{ id: 'm1', name: 'مطاعم' }]),
    createCategory: vi.fn(() => of(RESTAURANTS)),
    updateCategory: vi.fn(() => of(RESTAURANTS)),
    setCategoryStatus: vi.fn(() => of(RESTAURANTS)),
    deleteCategory: vi.fn((): Observable<void> => of(undefined)),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [CategoriesStore, { provide: CategoryRepository, useValue: repository }],
  });
  return { store: TestBed.inject(CategoriesStore), queries, repository };
}

describe('CategoriesStore', () => {
  it('loads a page of categories with the count behind each chip', () => {
    const { store } = createStore();

    store.loadCategories();

    expect(store.entries()).toEqual([RESTAURANTS]);
    expect(store.totalCount()).toBe(1);
    expect(store.kindChips()).toEqual([
      { value: 'all', label: 'الكل', count: 21 },
      { value: 'main', label: 'التصنيفات الرئيسية', count: 6 },
      { value: 'sub', label: 'التصنيفات الفرعية', count: 15 },
    ]);
  });

  it('keeps the error when the page cannot load', () => {
    const { store } = createStore({
      getCategories: () => throwError(() => new Error('تعذر التحميل')),
    });

    store.loadCategories();

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('loads the main categories as picker options', () => {
    const { store } = createStore();

    store.loadMainCategories();

    expect(store.mainCategories()).toEqual([{ id: 'm1', name: 'مطاعم' }]);
    expect(store.mainCategoryOptions()).toEqual([{ value: 'm1', label: 'مطاعم' }]);
  });

  it('starts on the "all" chip', () => {
    expect(createStore().store.kindChip()).toBe('all');
  });

  it('reloads from the first page with every filter it is given', () => {
    const { store, queries } = createStore({
      getCategories: (query) => {
        queries.push(query);
        return of({ ...PAGE, totalCount: 40 });
      },
    });
    store.changePage(3);

    store.setSearch('مطاعم');
    store.setSort('name');
    store.setKindChip('sub');
    store.setStatusFilter('active');
    store.setParentFilter('m1');

    expect(store.kindChip()).toBe('sub');
    expect(queries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 5,
      search: 'مطاعم',
      sort: 'name',
      kind: 'sub',
      status: 'active',
      parentId: 'm1',
    });
  });

  it('drops the kind filter on the "all" chip and cleared filters', () => {
    const { store, queries } = createStore();

    store.setKindChip('main');
    store.setKindChip('all');
    store.setStatusFilter('active');
    store.setStatusFilter(null);
    store.setParentFilter(null);

    expect(queries.at(-1)).toEqual({ pageIndex: 0, pageSize: 5 });
  });

  it('loads the page that was picked', () => {
    const { store, queries } = createStore({
      getCategories: (query) => {
        queries.push(query);
        return of({ ...PAGE, totalCount: 20 });
      },
    });
    store.loadCategories();

    store.changePage(2);

    expect(queries.at(-1)?.pageIndex).toBe(2);
  });

  it('creates, then reloads the page and the parent choices', async () => {
    const getMainCategories = vi.fn(() => of([]));
    const { store, queries, repository } = createStore({ getMainCategories });

    expect(await store.createCategory(DRAFT)).toBe(true);

    expect(repository.createCategory).toHaveBeenCalledWith(DRAFT);
    expect(queries).toHaveLength(1);
    expect(getMainCategories).toHaveBeenCalledOnce();
  });

  it('updates, changes the status of and deletes a category', async () => {
    const { store, repository } = createStore();

    await store.updateCategory('m1', DRAFT);
    await store.changeStatus('m1', 'suspended');
    await store.deleteCategory('m1');

    expect(repository.updateCategory).toHaveBeenCalledWith('m1', DRAFT);
    expect(repository.setCategoryStatus).toHaveBeenCalledWith('m1', 'suspended');
    expect(repository.deleteCategory).toHaveBeenCalledWith('m1');
  });

  it('keeps the save error and reports the failure', async () => {
    const { store } = createStore({
      createCategory: () => throwError(() => new Error('الاسم مستخدم')),
    });

    expect(await store.createCategory(DRAFT)).toBe(false);
    expect(store.saveError()).toBe('الاسم مستخدم');
  });

  it('says nothing exists yet when the list is empty without filters', () => {
    const { store } = createStore({
      getCategories: () => of({ ...PAGE, items: [], totalCount: 0 }),
    });

    store.loadCategories();

    expect(store.emptyMessage()).toBe('لا توجد تصنيفات مضافة حتى الآن');
  });

  it('says nothing matched once any filter is set', () => {
    const { store } = createStore({
      getCategories: () => of({ ...PAGE, items: [], totalCount: 0 }),
    });

    store.setParentFilter('m1');

    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة لبحثك');
  });
});
