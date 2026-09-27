import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdRepository } from '../data/ad.repository';
import { buildAdDetail } from '../testing/ad-fixture';
import { AdDetailStore } from './ad-detail.store';

const DETAIL = buildAdDetail();

function createStore(overrides: Partial<AdRepository> = {}) {
  TestBed.configureTestingModule({
    providers: [
      AdDetailStore,
      { provide: AdRepository, useValue: { getAdDetail: () => of(DETAIL), ...overrides } },
    ],
  });
  return TestBed.inject(AdDetailStore);
}

describe('AdDetailStore', () => {
  it('opens on one ad, builds its view, then forgets it when closed', () => {
    const store = createStore();

    store.open('ad-2');

    expect(store.isOpen()).toBe(true);
    expect(store.detail()).toEqual(DETAIL);
    expect(store.view()?.placementLabel).toBe('الصفحة الرئيسية');

    store.close();

    expect(store.isOpen()).toBe(false);
    expect(store.detail()).toBeNull();
  });

  it('keeps the error and reloads the open ad when asked again', () => {
    let attempts = 0;
    const store = createStore({
      getAdDetail: () => {
        attempts += 1;
        return attempts === 1 ? throwError(() => new Error('تعذر التحميل')) : of(DETAIL);
      },
    });

    store.open('ad-2');
    expect(store.error()).toBe('تعذر التحميل');

    store.reload();
    expect(store.detail()).toEqual(DETAIL);
  });
});
