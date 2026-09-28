import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthStore } from '../../../auth/state/auth.store';
import { AccountRepository } from '../../data/account.repository';
import { AccountProfile } from '../../models/account-profile';
import { buildAccountProfile } from '../../testing/settings-fixture';
import { AccountForms } from './account-forms';

const MERCHANT_LOGIN_URL = '/login?role=merchant';

function render(profile: AccountProfile, signOutDescription: string | null = null) {
  const signOut = vi.fn();
  const repository: Partial<AccountRepository> = { getProfile: () => of(profile) };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: AccountRepository, useValue: repository },
      { provide: AuthStore, useValue: { signOut } },
    ],
  });
  const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(AccountForms);
  fixture.componentRef.setInput('signOutUrl', MERCHANT_LOGIN_URL);
  fixture.componentRef.setInput('signOutDescription', signOutDescription);
  fixture.detectChanges();
  return { element: fixture.nativeElement as HTMLElement, signOut, navigate };
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

  it('passes the sign-out description on only when one is given', () => {
    const plain = render(buildAccountProfile()).element;

    expect(plain.querySelectorAll('app-sign-out-panel p')).toHaveLength(1);
  });

  it('signs out and goes to the login page it was given', () => {
    const { element, signOut, navigate } = render(buildAccountProfile());

    buttonNamed(element, 'تسجيل الخروج').click();

    expect(signOut).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith(MERCHANT_LOGIN_URL);
  });
});
