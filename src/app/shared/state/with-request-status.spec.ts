import { signalStore } from '@ngrx/signals';
import { withRequestStatus } from './with-request-status';

describe('withRequestStatus', () => {
  function createStore() {
    const Store = signalStore({ providedIn: 'root' }, withRequestStatus());
    return new Store();
  }

  it('starts idle with no error', () => {
    const store = createStore();

    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('setLoading turns loading on and clears the error', () => {
    const store = createStore();

    store.setError('boom');
    store.setLoading();

    expect(store.isLoading()).toBe(true);
    expect(store.error()).toBeNull();
  });

  it('setLoaded turns loading off', () => {
    const store = createStore();

    store.setLoading();
    store.setLoaded();

    expect(store.isLoading()).toBe(false);
  });

  it('setError turns loading off and stores the message', () => {
    const store = createStore();

    store.setLoading();
    store.setError('Network error');

    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBe('Network error');
  });
});
