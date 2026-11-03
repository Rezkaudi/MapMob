import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { NEVER, of } from 'rxjs';
import { AuthStore } from '../../../auth/state/auth.store';
import { AccountRepository } from '../../data/account.repository';
import { AccountProfile } from '../../models/account-profile';
import { buildAccountProfile } from '../../testing/settings-fixture';
import { AccountForms } from './account-forms';

const MERCHANT_LOGIN_URL = '/login?role=merchant';

function render(
  profile: AccountProfile,
  signOutDescription: string | null = null,
  isEmailEditable = true,
) {
  const revokeSession = vi.fn();
  const repository: Partial<AccountRepository> = { getProfile: () => of(profile) };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: AccountRepository, useValue: repository },
      { provide: AuthStore, useValue: { revokeSession } },
    ],
  });
  const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(AccountForms);
  fixture.componentRef.setInput('signOutUrl', MERCHANT_LOGIN_URL);
  fixture.componentRef.setInput('signOutDescription', signOutDescription);
  fixture.componentRef.setInput('isEmailEditable', isEmailEditable);
  fixture.detectChanges();
  return { element: fixture.nativeElement as HTMLElement, revokeSession, navigate };
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('AccountForms', () => {
  it('draws the personal card, the password card and the sign-out strip in that order', () => {
    const { element } = render(buildAccountProfile());

    expect(
      Array.from(element.querySelectorAll('h3'), (title) => title.textContent?.trim()),
    ).toEqual(['المعلومات الشخصية', 'تغيير كلمة المرور']);
    expect(element.querySelector('form + form + app-sign-out-panel')).not.toBeNull();
  });

  it('leaves the role badge out for an account without a role name', () => {
    const { element } = render(buildAccountProfile({ roleName: null }));

    expect(element.querySelector('[data-role="role-badge"]')).toBeNull();
    expect((element.querySelector('#account-full-name') as HTMLInputElement).value).toBe(
      'خولة محمد',
    );
  });

  it('lets the email be edited by default', () => {
    const { element } = render(buildAccountProfile());

    expect((element.querySelector('#account-email') as HTMLInputElement).readOnly).toBe(false);
  });

  it('shows the email as read-only when it may not be edited', () => {
    const profile = buildAccountProfile();
    const { element } = render(profile, null, false);

    const email = element.querySelector('#account-email') as HTMLInputElement;
    expect(email.value).toBe(profile.email);
    expect(email.readOnly).toBe(true);
    expect(email.className).toContain('read-only:opacity-60');
    expect(email.className).toContain('read-only:cursor-not-allowed');
  });

  it('gives every password input an eye button that shows and hides it', () => {
    const { element } = render(buildAccountProfile());
    const passwordIds = ['current-password', 'new-password', 'confirm-password'];

    for (const id of passwordIds) {
      const input = element.querySelector(`#${id}`) as HTMLInputElement;
      expect(input.type).toBe('password');
      input.parentElement!.querySelector<HTMLButtonElement>('button[aria-pressed]')!.click();
    }
    TestBed.tick();

    expect(
      passwordIds.map((id) => (element.querySelector(`#${id}`) as HTMLInputElement).type),
    ).toEqual(['text', 'text', 'text']);
  });

  it('passes the sign-out description on only when one is given', () => {
    const plain = render(buildAccountProfile()).element;

    expect(plain.querySelectorAll('app-sign-out-panel p')).toHaveLength(1);
  });

  it('signs out and goes to the login page it was given', () => {
    const { element, revokeSession, navigate } = render(buildAccountProfile());

    buttonNamed(element, 'تسجيل الخروج').click();

    expect(revokeSession).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith(MERCHANT_LOGIN_URL);
  });
});

describe('AccountForms while saving', () => {
  function renderPending() {
    const repository: Partial<AccountRepository> = {
      getProfile: () => of(buildAccountProfile()),
      updateProfile: () => NEVER,
      changePassword: () => NEVER,
    };
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AccountRepository, useValue: repository },
        { provide: AuthStore, useValue: { revokeSession: vi.fn() } },
      ],
    });
    const fixture = TestBed.createComponent(AccountForms);
    fixture.componentRef.setInput('signOutUrl', MERCHANT_LOGIN_URL);
    fixture.detectChanges();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  function typeInto(element: HTMLElement, id: string, value: string): void {
    const input = element.querySelector(`#${id}`) as HTMLInputElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  it('spins on the profile save button until the server answers', () => {
    const { fixture, element } = renderPending();
    const [profileForm] = Array.from(element.querySelectorAll('form'));

    profileForm.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(profileForm.querySelector('button[type="submit"] app-spinner')).not.toBeNull();
  });

  it('spins on the password button until the server answers', () => {
    const { fixture, element } = renderPending();
    typeInto(element, 'current-password', 'Old-pass-123');
    typeInto(element, 'new-password', 'New-pass-456');
    typeInto(element, 'confirm-password', 'New-pass-456');
    const passwordForm = Array.from(element.querySelectorAll('form')).at(-1) as HTMLFormElement;

    passwordForm.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    expect(passwordForm.querySelector('button[type="submit"] app-spinner')).not.toBeNull();
  });
});
