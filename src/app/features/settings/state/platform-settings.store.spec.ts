import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PlatformSettingsRepository } from '../data/platform-settings.repository';
import { buildPlatformSettings } from '../testing/settings-fixture';
import { PlatformSettingsStore } from './platform-settings.store';

const SETTINGS = buildPlatformSettings();

function createStore(overrides: Partial<PlatformSettingsRepository> = {}) {
  const repository: Partial<PlatformSettingsRepository> = {
    getSettings: () => of(SETTINGS),
    updateGeneral: ({ logo, ...fields }) =>
      of({ ...fields, logoFileName: logo?.name ?? SETTINGS.general.logoFileName }),
    updateMap: (map) => of(map),
    updateLanguage: (language) => of(language),
    updateCurrency: (currency) => of(currency),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      PlatformSettingsStore,
      { provide: PlatformSettingsRepository, useValue: repository },
    ],
  });
  const store = TestBed.inject(PlatformSettingsStore);
  store.loadSettings();
  return store;
}

describe('PlatformSettingsStore', () => {
  it('loads the settings', () => {
    expect(createStore().settings()).toEqual(SETTINGS);
  });

  it('reports a failed load', () => {
    const store = createStore({ getSettings: () => throwError(() => new Error('تعذر التحميل')) });

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('saves the basic information and swaps it into the settings', async () => {
    const store = createStore();

    await store.saveGeneral({ ...SETTINGS.general, appName: 'MapMob Pro', logo: null });

    expect(store.settings()?.general.appName).toBe('MapMob Pro');
    expect(store.savedForm()).toBe('general');
  });

  it('saves each other card without touching the rest', async () => {
    const store = createStore();

    await store.saveMap({ distanceUnit: 'mile', searchRadiusKm: 30 });
    expect(store.savedForm()).toBe('map');
    await store.saveLanguage({ defaultLanguage: 'en', detectsDeviceLanguage: false });
    expect(store.savedForm()).toBe('language');
    await store.saveCurrency({ currency: 'USD', currencySymbol: '$', decimalPlaces: 2 });
    expect(store.savedForm()).toBe('currency');

    expect(store.settings()).toEqual({
      general: SETTINGS.general,
      map: { distanceUnit: 'mile', searchRadiusKm: 30 },
      language: { defaultLanguage: 'en', detectsDeviceLanguage: false },
      currency: { currency: 'USD', currencySymbol: '$', decimalPlaces: 2 },
    });
  });

  it('keeps the saved settings when a save fails', async () => {
    const store = createStore({ updateMap: () => throwError(() => new Error('تعذر الحفظ')) });

    expect(await store.saveMap({ distanceUnit: 'mile', searchRadiusKm: 30 })).toBe(false);

    expect(store.settings()?.map).toEqual(SETTINGS.map);
    expect(store.failedForm()).toBe('map');
  });
});
