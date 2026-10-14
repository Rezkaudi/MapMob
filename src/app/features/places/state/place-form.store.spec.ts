import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PlaceRepository } from '../data/place.repository';
import { createPlaceDetail } from '../testing/place-detail-fixture';
import { PLACE_MOCK_FORM_CHOICES } from '../data/place-mock-form-choices';
import { buildPlaceSaveRequest } from '../testing/place-save-request-fixture';
import { PlaceFormStore } from './place-form.store';

function createStore(overrides: Partial<PlaceRepository> = {}) {
  const asked: string[] = [];
  const repository: Partial<PlaceRepository> = {
    getPlace: (id) => {
      asked.push(id);
      return of(createPlaceDetail({ id }));
    },
    getPlaceFormChoices: () => of(PLACE_MOCK_FORM_CHOICES),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [PlaceFormStore, { provide: PlaceRepository, useValue: repository }],
  });
  return { store: TestBed.inject(PlaceFormStore), asked };
}

describe('PlaceFormStore', () => {
  it('asks for nothing when the form adds a new place', () => {
    const { store, asked } = createStore();

    store.load(null);

    expect(asked).toEqual([]);
    expect(store.editedPlace()).toBeNull();
    expect(store.isReady()).toBe(true);
  });

  it('loads the place the form edits', () => {
    const { store, asked } = createStore();

    store.load('place-7');

    expect(asked).toEqual(['place-7']);
    expect(store.editedPlace()?.id).toBe('place-7');
    expect(store.isReady()).toBe(true);
  });

  it('keeps the load error and tries again on retry', () => {
    let calls = 0;
    const { store } = createStore({
      getPlace: (id) =>
        ++calls === 1
          ? throwError(() => new Error('تعذر تحميل المكان'))
          : of(createPlaceDetail({ id })),
    });

    store.load('place-7');
    expect(store.error()).toBe('تعذر تحميل المكان');
    expect(store.isReady()).toBe(false);

    store.retry();
    expect(store.error()).toBeNull();
    expect(store.editedPlace()?.id).toBe('place-7');
  });

  it('loads the form choices with the place', () => {
    const { store } = createStore();

    store.load(null);

    expect(store.choices()).toEqual(PLACE_MOCK_FORM_CHOICES);
  });

  it('saves the form and answers with the saved id', async () => {
    const saved: (string | null)[] = [];
    const { store } = createStore({
      savePlace: (id) => {
        saved.push(id);
        return of('52');
      },
    });

    const savedId = await store.save('52', buildPlaceSaveRequest());

    expect(savedId).toBe('52');
    expect(saved).toEqual(['52']);
    expect(store.isSaving()).toBe(false);
  });

  it('keeps the save error to show it, and answers null', async () => {
    const { store } = createStore({
      savePlace: () => throwError(() => new Error('تعذر الحفظ')),
    });

    expect(await store.save(null, buildPlaceSaveRequest())).toBeNull();
    expect(store.saveError()).toBe('تعذر الحفظ');

    store.clearSaveError();
    expect(store.saveError()).toBeNull();
  });
});
