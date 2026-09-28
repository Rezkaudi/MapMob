import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { StoreProfileRepository } from '../data/store-profile.repository';
import { StoreProfile } from '../models/store-profile';
import { StoreProfileUpdate } from '../models/store-profile-update';
import { buildStoreProfile } from '../testing/store-profile-fixture';
import { toStoreProfileFormValue, toStoreProfileUpdate } from './store-profile-form-mapping';
import { StoreProfileStore } from './store-profile.store';

describe('StoreProfileStore', () => {
  const update = (): StoreProfileUpdate =>
    toStoreProfileUpdate(toStoreProfileFormValue(buildStoreProfile()), null);

  function setUp(repository: Partial<StoreProfileRepository>) {
    TestBed.configureTestingModule({
      providers: [StoreProfileStore, { provide: StoreProfileRepository, useValue: repository }],
    });
    return TestBed.inject(StoreProfileStore);
  }

  it('loads the place', () => {
    const store = setUp({ getProfile: () => of(buildStoreProfile()) });

    store.load();

    expect(store.profile()?.name).toBe('صيدلية الحياة');
    expect(store.isLoading()).toBe(false);
    expect(store.error()).toBeNull();
  });

  it('shows the load error', () => {
    const store = setUp({ getProfile: () => throwError(() => new Error('تعذر تحميل المتجر')) });

    store.load();

    expect(store.profile()).toBeNull();
    expect(store.error()).toBe('تعذر تحميل المتجر');
  });

  it('keeps the saved place and says it was saved', () => {
    const saved = buildStoreProfile({ name: 'صيدلية الشفاء' });
    const saveProfile = vi.fn((): Observable<StoreProfile> => of(saved));
    const store = setUp({ getProfile: () => of(buildStoreProfile()), saveProfile });
    store.load();

    store.save(update());

    expect(saveProfile).toHaveBeenCalledOnce();
    expect(store.profile()?.name).toBe('صيدلية الشفاء');
    expect(store.isSaving()).toBe(false);
    expect(store.hasSaved()).toBe(true);

    store.dismissSaveResult();
    expect(store.hasSaved()).toBe(false);
  });

  it('keeps the page and reports a failed save', () => {
    const store = setUp({
      getProfile: () => of(buildStoreProfile()),
      saveProfile: () => throwError(() => new Error('الشبكة غير متاحة')),
    });
    store.load();

    store.save(update());

    expect(store.profile()?.name).toBe('صيدلية الحياة');
    expect(store.isSaving()).toBe(false);
    expect(store.hasSaved()).toBe(false);
    expect(store.saveError()).toBe('الشبكة غير متاحة');
  });
});
