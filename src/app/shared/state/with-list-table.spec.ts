import { signalStore } from '@ngrx/signals';
import { of, throwError } from 'rxjs';
import { LIST_PAGE_SIZE, withListTable } from './with-list-table';

interface NamedEntry {
  readonly id: string;
  readonly name: string;
}

const TARTUS: NamedEntry = { id: 'a', name: 'طرطوس' };
const HOMS: NamedEntry = { id: 'b', name: 'حمص' };

describe('withListTable', () => {
  function createStore() {
    const Store = signalStore({ providedIn: 'root' }, withListTable<NamedEntry>());
    return new Store();
  }

  it('shows the number of rows the design draws per page', () => {
    expect(createStore().pageSize()).toBe(LIST_PAGE_SIZE);
  });

  it('draws a different number of rows when a feature asks for it', () => {
    const Store = signalStore({ providedIn: 'root' }, withListTable<NamedEntry>({ pageSize: 6 }));

    expect(new Store().pageSize()).toBe(6);
  });

  it('builds the query from the page, search and sort', () => {
    const store = createStore();
    store.applyQuery({ search: 'حمص', sort: 'name' });

    expect(store.currentQuery()).toEqual({
      pageIndex: 0,
      pageSize: LIST_PAGE_SIZE,
      search: 'حمص',
      sort: 'name',
    });
  });

  it('leaves an empty search and sort out of the query', () => {
    const store = createStore();
    store.applyQuery({ search: '   ' });

    expect(store.currentQuery()).toEqual({ pageIndex: 0, pageSize: LIST_PAGE_SIZE });
  });

  it('reports a fresh page as nothing more to do', () => {
    const store = createStore();

    expect(store.showPage({ items: [TARTUS, HOMS], totalCount: 12 })).toBe(false);
  });

  it('steps back when a reload leaves the current page past the end of the rows', () => {
    const store = createStore();
    store.showPage({ items: [TARTUS], totalCount: 12 });
    store.goToPage(2);

    const isPageStale = store.showPage({ items: [], totalCount: 7 });

    expect(isPageStale).toBe(true);
    expect(store.pageIndex()).toBe(1);
  });

  it('stays on the first page when a reload empties the list entirely', () => {
    const store = createStore();
    store.showPage({ items: [TARTUS], totalCount: 3 });

    const isPageStale = store.showPage({ items: [], totalCount: 0 });

    expect(isPageStale).toBe(false);
    expect(store.pageIndex()).toBe(0);
  });

  it('keeps the ticks of rows that survived the reload', () => {
    const store = createStore();
    store.showPage({ items: [TARTUS, HOMS], totalCount: 12 });
    store.toggleSelected('a');
    store.toggleSelected('b');

    store.showPage({ items: [TARTUS], totalCount: 11 });

    expect(store.selectedIds()).toEqual(['a']);
  });

  it('goes back to the first page and clears the ticks when the query changes', () => {
    const store = createStore();
    store.showPage({ items: [TARTUS, HOMS], totalCount: 12 });
    store.goToPage(2);
    store.toggleSelected('a');

    store.applyQuery({ sort: 'newest' });

    expect(store.pageIndex()).toBe(0);
    expect(store.selectedIds()).toEqual([]);
  });

  it('goes back to the first page and clears the ticks when a feature filter changes', () => {
    const store = createStore();
    store.showPage({ items: [TARTUS, HOMS], totalCount: 12 });
    store.goToPage(2);
    store.toggleSelected('a');

    store.resetToFirstPage();

    expect(store.pageIndex()).toBe(0);
    expect(store.selectedIds()).toEqual([]);
  });

  it('stores a loaded page', () => {
    const store = createStore();
    store.setLoading();

    store.showPage({ items: [TARTUS], totalCount: 1 });

    expect(store.entries()).toEqual([TARTUS]);
    expect(store.totalCount()).toBe(1);
    expect(store.isLoading()).toBe(false);
  });

  it('tells an empty list apart from a search with no match', () => {
    const store = createStore();
    store.showPage({ items: [], totalCount: 0 });
    expect(store.hasNoEntries()).toBe(true);
    expect(store.hasNoResults()).toBe(true);

    store.applyQuery({ search: 'xyz' });
    expect(store.hasNoEntries()).toBe(false);
    expect(store.hasNoResults()).toBe(true);
  });

  it('does not report an empty list while a page is loading', () => {
    const store = createStore();
    store.setLoading();

    expect(store.hasNoEntries()).toBe(false);
    expect(store.hasNoResults()).toBe(false);
  });

  it('ticks every visible row, then clears them', () => {
    const store = createStore();
    store.showPage({ items: [TARTUS, HOMS], totalCount: 2 });

    store.toggleAllVisible();
    expect(store.areAllVisibleSelected()).toBe(true);

    store.toggleAllVisible();
    expect(store.selectedIds()).toEqual([]);
  });

  it('steps back a page once the last row of that page is removed', () => {
    const store = createStore();
    store.showPage({ items: [TARTUS], totalCount: LIST_PAGE_SIZE + 1 });
    store.goToPage(1);
    store.toggleSelected('a');

    store.forgetRemovedEntry('a');

    expect(store.pageIndex()).toBe(0);
    expect(store.isSelected('a')).toBe(false);
  });

  it('stays on the page when other rows remain', () => {
    const store = createStore();
    store.showPage({ items: [TARTUS, HOMS], totalCount: LIST_PAGE_SIZE + 2 });
    store.goToPage(1);

    store.forgetRemovedEntry('a');

    expect(store.pageIndex()).toBe(1);
  });

  it('refreshes after a save succeeds, running the success step first', async () => {
    const store = createStore();
    const steps: string[] = [];

    const isSaved = await store.saveThenRefresh(
      of(null),
      () => steps.push('refresh'),
      () => steps.push('saved'),
    );

    expect(isSaved).toBe(true);
    expect(steps).toEqual(['saved', 'refresh']);
  });

  it('does not refresh when a save fails', async () => {
    const store = createStore();
    const refresh = vi.fn();

    expect(
      await store.saveThenRefresh(
        throwError(() => new Error('x')),
        refresh,
      ),
    ).toBe(false);
    expect(refresh).not.toHaveBeenCalled();
  });
});
