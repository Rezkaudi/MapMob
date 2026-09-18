import { signalStore } from '@ngrx/signals';
import { withSelection } from './with-selection';

describe('withSelection', () => {
  function createStore() {
    const Store = signalStore({ providedIn: 'root' }, withSelection());
    return new Store();
  }

  it('starts with nothing selected', () => {
    const store = createStore();

    expect(store.selectedIds()).toEqual([]);
    expect(store.isSelected('a')).toBe(false);
  });

  it('toggleSelected adds then removes an id', () => {
    const store = createStore();

    store.toggleSelected('a');
    expect(store.isSelected('a')).toBe(true);
    expect(store.selectedIds()).toEqual(['a']);

    store.toggleSelected('a');
    expect(store.isSelected('a')).toBe(false);
    expect(store.selectedIds()).toEqual([]);
  });

  it('selectAll replaces the selection with the given ids', () => {
    const store = createStore();

    store.selectAll(['a', 'b', 'c']);

    expect(store.selectedIds()).toEqual(['a', 'b', 'c']);
  });

  it('keepOnlySelected drops the ids that are no longer on the page', () => {
    const store = createStore();
    store.selectAll(['a', 'b', 'c']);

    store.keepOnlySelected(['a', 'c', 'd']);

    expect(store.selectedIds()).toEqual(['a', 'c']);
  });

  it('keepOnlySelected leaves a matching selection untouched', () => {
    const store = createStore();
    store.selectAll(['a', 'b']);

    store.keepOnlySelected(['a', 'b']);

    expect(store.selectedIds()).toEqual(['a', 'b']);
  });

  it('clearSelection empties the selection', () => {
    const store = createStore();
    store.selectAll(['a', 'b']);

    store.clearSelection();

    expect(store.selectedIds()).toEqual([]);
  });
});
