import { TestBed } from '@angular/core/testing';
import { signalStore } from '@ngrx/signals';
import { Observable, of, throwError } from 'rxjs';
import { withFormSaveStatus } from './with-form-save-status';

const TestStore = signalStore(withFormSaveStatus<'first' | 'second'>());

function createStore() {
  TestBed.configureTestingModule({ providers: [TestStore] });
  return TestBed.inject(TestStore);
}

describe('withFormSaveStatus', () => {
  it('remembers which form was saved until the notice is dismissed', async () => {
    const store = createStore();

    expect(await store.saveForm('second', of(null))).toBe(true);
    expect(store.savedForm()).toBe('second');

    store.dismissSavedNotice();
    expect(store.savedForm()).toBeNull();
  });

  it('knows which form is busy', () => {
    const store = createStore();

    void store.saveForm('first', new Observable());

    expect(store.isFormSaving('first')).toBe(true);
    expect(store.isFormSaving('second')).toBe(false);
  });

  it('keeps the error with the form that failed, until it is cleared', async () => {
    const store = createStore();

    expect(
      await store.saveForm(
        'first',
        throwError(() => new Error('تعذر الحفظ')),
      ),
    ).toBe(false);
    expect(store.failedForm()).toBe('first');
    expect(store.saveError()).toBe('تعذر الحفظ');

    store.clearSaveError();
    expect(store.failedForm()).toBeNull();
  });

  it('drops the last saved notice when another save starts', async () => {
    const store = createStore();
    await store.saveForm('first', of(null));

    void store.saveForm('second', new Observable());

    expect(store.savedForm()).toBeNull();
  });
});
