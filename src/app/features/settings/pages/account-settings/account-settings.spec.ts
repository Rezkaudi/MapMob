import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthStore } from '../../../auth/state/auth.store';
import { AccountRepository } from '../../data/account.repository';
import { AccountProfileDraft } from '../../models/account-profile-draft';
import { PasswordChange } from '../../models/password-change';
import { buildAccountProfile } from '../../testing/settings-fixture';
import { AccountSettings } from './account-settings';

function render(overrides: Partial<AccountRepository> = {}) {
  const savedProfiles: AccountProfileDraft[] = [];
  const passwordChanges: PasswordChange[] = [];
  const repository: Partial<AccountRepository> = {
    getProfile: () => of(buildAccountProfile()),
    updateProfile: (draft) => {
      savedProfiles.push(draft);
      return of(buildAccountProfile(draft));
    },
    changePassword: (change) => {
      passwordChanges.push(change);
      return of(undefined);
    },
    ...overrides,
  };
  const signOut = vi.fn();
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: AccountRepository, useValue: repository },
      { provide: AuthStore, useValue: { signOut } },
    ],
  });
  const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(AccountSettings);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  return { fixture, element, savedProfiles, passwordChanges, signOut, navigate };
}

function type(element: HTMLElement, selector: string, value: string): void {
  const field = element.querySelector(selector) as HTMLInputElement;
  field.value = value;
  field.dispatchEvent(new Event('input'));
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

async function settle(fixture: { whenStable(): Promise<unknown>; detectChanges(): void }) {
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('AccountSettings', () => {
  it('heads the section and shows the role badge in the personal card', () => {
    const { element } = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إعدادات الحساب');
    expect(element.textContent).toContain('إدارة بيانات حسابك الشخصي كمشرف على منصة MapMob');
    expect(element.querySelector('[data-role="role-badge"]')?.textContent?.trim()).toBe(
      'مسؤول النظام الرئيسي (Super Admin)',
    );
  });

  it('fills the personal fields from the profile', () => {
    const { element } = render();

    expect((element.querySelector('#account-full-name') as HTMLInputElement).value).toBe(
      'خولة محمد',
    );
    expect((element.querySelector('#account-email') as HTMLInputElement).value).toBe(
      'khawla.mo@mapmob.com',
    );
  });

  it('saves the personal information and confirms it', async () => {
    const { fixture, element, savedProfiles } = render();

    type(element, '#account-full-name', 'سارة أحمد');
    buttonNamed(element, 'حفظ التغييرات').click();
    await settle(fixture);

    expect(savedProfiles).toEqual([{ fullName: 'سارة أحمد', email: 'khawla.mo@mapmob.com' }]);
    expect(element.querySelector('app-toast')?.textContent).toContain('تم حفظ التغييرات');
  });

  it('does not save an empty name, and says why', () => {
    const { fixture, element, savedProfiles } = render();

    type(element, '#account-full-name', '');
    buttonNamed(element, 'حفظ التغييرات').click();
    fixture.detectChanges();

    expect(savedProfiles).toEqual([]);
    expect(element.textContent).toContain('اكتب الاسم الكامل');
  });

  it('updates the password, then clears the three fields', async () => {
    const { fixture, element, passwordChanges } = render();

    type(element, '#current-password', 'currentPass123');
    type(element, '#new-password', 'newPass1234');
    type(element, '#confirm-password', 'newPass1234');
    buttonNamed(element, 'تحديث كلمة المرور').click();
    await settle(fixture);

    expect(passwordChanges).toEqual([
      { currentPassword: 'currentPass123', newPassword: 'newPass1234' },
    ]);
    expect((element.querySelector('#new-password') as HTMLInputElement).value).toBe('');
    expect(element.querySelector('app-toast')?.textContent).toContain('تم تحديث كلمة المرور');
  });

  it('refuses a confirmation that does not match', () => {
    const { fixture, element, passwordChanges } = render();

    type(element, '#current-password', 'currentPass123');
    type(element, '#new-password', 'newPass1234');
    type(element, '#confirm-password', 'different123');
    buttonNamed(element, 'تحديث كلمة المرور').click();
    fixture.detectChanges();

    expect(passwordChanges).toEqual([]);
    expect(element.textContent).toContain('كلمتا المرور غير متطابقتين');
  });

  it('shows why the password could not be changed', async () => {
    const { fixture, element } = render({
      changePassword: () => throwError(() => new Error('كلمة المرور الحالية غير صحيحة')),
    });

    type(element, '#current-password', 'wrongPass123');
    type(element, '#new-password', 'newPass1234');
    type(element, '#confirm-password', 'newPass1234');
    buttonNamed(element, 'تحديث كلمة المرور').click();
    await settle(fixture);

    const toast = element.querySelector('app-toast');
    expect(toast?.textContent).toContain('تعذر تحديث كلمة المرور');
    expect(toast?.textContent).toContain('كلمة المرور الحالية غير صحيحة');
  });

  it('signs out and goes to the login page', () => {
    const { element, signOut, navigate } = render();

    buttonNamed(element, 'تسجيل الخروج').click();

    expect(signOut).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith('/login');
  });
});
