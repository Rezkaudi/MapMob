import { signalStore } from '@ngrx/signals';
import { withPagination } from './with-pagination';

describe('withPagination', () => {
  function createStore() {
    const Store = signalStore({ providedIn: 'root' }, withPagination());
    return new Store();
  }

  it('starts on page 0 with a default page size and no pages', () => {
    const store = createStore();

    expect(store.pageIndex()).toBe(0);
    expect(store.pageSize()).toBe(20);
    expect(store.totalCount()).toBe(0);
    expect(store.pageCount()).toBe(0);
  });

  it('computes the page count from the total count and page size', () => {
    const store = createStore();

    store.setTotalCount(45);

    expect(store.pageCount()).toBe(3);
  });

  it('goToPage moves within bounds', () => {
    const store = createStore();
    store.setTotalCount(45);

    store.goToPage(2);

    expect(store.pageIndex()).toBe(2);
  });

  it('goToPage clamps to the last page', () => {
    const store = createStore();
    store.setTotalCount(45);

    store.goToPage(99);

    expect(store.pageIndex()).toBe(2);
  });

  it('goToPage clamps to zero', () => {
    const store = createStore();
    store.setTotalCount(45);

    store.goToPage(-3);

    expect(store.pageIndex()).toBe(0);
  });

  it('setPageSize resets to the first page', () => {
    const store = createStore();
    store.setTotalCount(45);
    store.goToPage(2);

    store.setPageSize(10);

    expect(store.pageSize()).toBe(10);
    expect(store.pageIndex()).toBe(0);
  });
});
