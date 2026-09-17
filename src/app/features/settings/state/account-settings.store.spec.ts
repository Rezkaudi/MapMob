import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { AccountRepository } from '../data/account.repository';
import { buildAccountProfile } from '../testing/settings-fixture';
import { AccountSettingsStore } from './account-settings.store';

const PROFILE = buildAccountProfile();

function createStore(overrides: Partial<AccountRepository> = {}) {
  const repository: Partial<AccountRepository> = {
    getProfile: () => of(PROFILE),
    updateProfile: (draft) => of({ ...PROFILE, ...draft }),
    changePassword: () => of(undefined),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [AccountSettingsStore, { provide: AccountRepository, useValue: repository }],
  });
  return TestBed.inject(AccountSettingsStore);
}

const fail = (message: string) => (): Observable<never> => throwError(() => new Error(message));

describe('AccountSettingsStore', () => {
  it('loads the profile', () => {
    const store = createStore();

    store.loadProfile();

    expect(store.profile()).toEqual(PROFILE);
    expect(store.isLoading()).toBe(false);
  });

  it('reports a failed load', () => {
    const store = createStore({ getProfile: fail('تعذر تحميل الحساب') });

    store.loadProfile();

    expect(store.error()).toBe('تعذر تحميل الحساب');
  });

  it('saves the profile and says which form was saved', async () => {
    const store = createStore();
    store.loadProfile();

    const isSaved = await store.saveProfile({ fullName: 'سارة', email: 'sara@mapmob.com' });

    expect(isSaved).toBe(true);
    expect(store.profile()).toEqual({ ...PROFILE, fullName: 'سارة', email: 'sara@mapmob.com' });
    expect(store.savedForm()).toBe('profile');

    store.dismissSavedNotice();
    expect(store.savedForm()).toBeNull();
  });

  it('changes the password and says so', async () => {
    const store = createStore();

    expect(
      await store.changePassword({ currentPassword: 'currentPass123', newPassword: 'newPass1234' }),
    ).toBe(true);
    expect(store.savedForm()).toBe('password');
  });

  it('keeps the error of the form that failed', async () => {
    const store = createStore({ changePassword: fail('كلمة المرور الحالية غير صحيحة') });

    expect(
      await store.changePassword({ currentPassword: 'wrong', newPassword: 'newPass1234' }),
    ).toBe(false);

    expect(store.failedForm()).toBe('password');
    expect(store.saveError()).toBe('كلمة المرور الحالية غير صحيحة');
    expect(store.savedForm()).toBeNull();

    store.clearSaveError();
    expect(store.failedForm()).toBeNull();
    expect(store.saveError()).toBeNull();
  });

  it('knows which form is busy while it saves', () => {
    const store = createStore({ updateProfile: () => new Observable() });

    void store.saveProfile({ fullName: 'سارة', email: 'sara@mapmob.com' });

    expect(store.isSavingProfile()).toBe(true);
    expect(store.isChangingPassword()).toBe(false);
  });
});
