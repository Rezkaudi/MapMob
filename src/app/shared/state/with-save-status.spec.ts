import { signalStore } from '@ngrx/signals';
import { Subject, of, throwError } from 'rxjs';
import { withSaveStatus } from './with-save-status';

describe('withSaveStatus', () => {
  function createStore() {
    const Store = signalStore({ providedIn: 'root' }, withSaveStatus());
    return new Store();
  }

  it('starts idle with no error', () => {
    const store = createStore();

    expect(store.isSaving()).toBe(false);
    expect(store.saveError()).toBeNull();
  });

  it('is busy while the request runs and reports success when it ends', async () => {
    const store = createStore();
    const request = new Subject<string>();

    const result = store.runSave(request);
    expect(store.isSaving()).toBe(true);

    request.next('done');
    request.complete();

    expect(await result).toBe(true);
    expect(store.isSaving()).toBe(false);
  });

  it('keeps the error message and reports failure', async () => {
    const store = createStore();

    const result = await store.runSave(throwError(() => new Error('تعذر الحفظ')));

    expect(result).toBe(false);
    expect(store.isSaving()).toBe(false);
    expect(store.saveError()).toBe('تعذر الحفظ');
  });

  it('clears an old error when a new save starts and when asked', async () => {
    const store = createStore();
    await store.runSave(throwError(() => new Error('تعذر الحفظ')));

    await store.runSave(of(null));
    expect(store.saveError()).toBeNull();

    await store.runSave(throwError(() => new Error('تعذر الحفظ')));
    store.clearSaveError();
    expect(store.saveError()).toBeNull();
  });
});
