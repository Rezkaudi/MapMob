import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdRepository } from '../data/ad.repository';
import { buildAd, buildAdDetail, buildAdDraft } from '../testing/ad-fixture';
import { AdFormStore } from './ad-form.store';

const OPTIONS = { places: [{ id: 'place-3', name: 'صيدلية الحياة' }] };

function createStore(overrides: Partial<AdRepository> = {}) {
  const saved: string[] = [];
  const repository: Partial<AdRepository> = {
    getFormOptions: () => of(OPTIONS),
    getAdDetail: () => of(buildAdDetail()),
    createAd: () => {
      saved.push('create');
      return of(buildAd());
    },
    updateAd: (id) => {
      saved.push(`update ${id}`);
      return of(buildAd());
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [AdFormStore, { provide: AdRepository, useValue: repository }],
  });
  return { store: TestBed.inject(AdFormStore), saved };
}

describe('AdFormStore', () => {
  it('loads the options for a new ad, and the ad being edited', () => {
    const { store } = createStore();

    store.load(null);
    expect(store.isReady()).toBe(true);
    expect(store.editedDetail()).toBeNull();

    store.load('ad-2');
    expect(store.editedDetail()?.ad.id).toBe('ad-2');
  });

  it('keeps the load error and tries again on retry', () => {
    let calls = 0;
    const { store } = createStore({
      getFormOptions: () =>
        ++calls === 1 ? throwError(() => new Error('تعذر تحميل البيانات')) : of(OPTIONS),
    });

    store.load(null);
    expect(store.error()).toBe('تعذر تحميل البيانات');
    store.retry();
    expect(store.isReady()).toBe(true);
  });

  it('creates a new ad and updates an edited one', async () => {
    const { store, saved } = createStore();

    expect(await store.save(null, buildAdDraft())).toBe(true);
    expect(await store.save('ad-2', buildAdDraft())).toBe(true);
    expect(saved).toEqual(['create', 'update ad-2']);
  });
});
