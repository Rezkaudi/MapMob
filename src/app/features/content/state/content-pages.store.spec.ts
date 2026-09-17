import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContentPageRepository } from '../data/content-page.repository';
import { buildContentPage } from '../testing/content-fixture';
import { ContentPagesStore } from './content-pages.store';

const PAGES = [
  buildContentPage(),
  buildContentPage({ kind: 'terms', title: 'الشروط و الأحكام' }),
  buildContentPage({ kind: 'privacy', title: 'سياسة الخصوصية' }),
];

function createStore(overrides: Partial<ContentPageRepository> = {}) {
  const repository: Partial<ContentPageRepository> = { getPages: () => of(PAGES), ...overrides };
  TestBed.configureTestingModule({
    providers: [{ provide: ContentPageRepository, useValue: repository }],
  });
  return TestBed.inject(ContentPagesStore);
}

describe('ContentPagesStore', () => {
  it('loads the pages and shows them all', () => {
    const store = createStore();

    store.loadPages();

    expect(store.visiblePages().map((page) => page.kind)).toEqual(['about', 'terms', 'privacy']);
    expect(store.isLoading()).toBe(false);
    expect(store.hasNoResults()).toBe(false);
  });

  it('reports a failed load', () => {
    const store = createStore({
      getPages: () => throwError(() => new Error('تعذر تحميل الصفحات')),
    });

    store.loadPages();

    expect(store.error()).toBe('تعذر تحميل الصفحات');
  });

  it('finds pages by name, ignoring spaces around the search', () => {
    const store = createStore();
    store.loadPages();

    store.setSearch('  الخصوصية ');

    expect(store.visiblePages().map((page) => page.kind)).toEqual(['privacy']);
  });

  it('says when no page matches', () => {
    const store = createStore();
    store.loadPages();

    store.setSearch('غير موجود');

    expect(store.hasNoResults()).toBe(true);
  });

  it('selects one page, then every shown page, then none', () => {
    const store = createStore();
    store.loadPages();

    store.toggleSelected('terms');
    expect(store.selectedIdSet().has('terms')).toBe(true);
    expect(store.areAllVisibleSelected()).toBe(false);

    store.toggleAllVisible();
    expect(store.areAllVisibleSelected()).toBe(true);

    store.toggleAllVisible();
    expect(store.selectedIds()).toEqual([]);
  });

  it('does not count an empty list as all selected', () => {
    const store = createStore({ getPages: () => of([]) });

    store.loadPages();

    expect(store.areAllVisibleSelected()).toBe(false);
  });
});
