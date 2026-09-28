import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { AuthStore } from '../../../auth/state/auth.store';
import { AccountRepository } from '../../../settings/data/account.repository';
import { MerchantSettingsPage } from './merchant-settings-page';

function render() {
  const signOut = vi.fn();
  const repository: Partial<AccountRepository> = {
    getProfile: () => of({ fullName: 'محمد احمد', email: 'mmmm.mo@mapmob.com', roleName: null }),
  };
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: AccountRepository, useValue: repository },
      { provide: AuthStore, useValue: { signOut } },
    ],
  });
  const navigate = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(MerchantSettingsPage);
  fixture.detectChanges();
  return { element: fixture.nativeElement as HTMLElement, signOut, navigate };
}

describe('MerchantSettingsPage', () => {
  it('heads the page at 28px with the 12px line the frame writes under it', () => {
    const { element } = render();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('إعدادات الحساب');
    const description = element.querySelector('app-page-header p') as HTMLElement;
    expect(description.textContent?.trim()).toBe('إدارة بيانات حسابك .');
    expect(description.className).toContain('text-[12px]/[18px]');
  });

  it('leaves the cards 26px under the heading, as the frame does', () => {
    const { element } = render();

    expect(element.querySelector('app-account-forms')?.className).toContain('mt-[26px]');
  });

  it('holds the personal card at the fixed 233px the frame draws', () => {
    const { element } = render();

    expect(element.querySelector('app-account-forms')?.className).toContain(
      '[&>form:first-of-type_section]:min-h-[233px]',
    );
  });

  it('shows the owner account without a role badge or a second sign-out line', () => {
    const { element } = render();

    expect((element.querySelector('#account-full-name') as HTMLInputElement).value).toBe(
      'محمد احمد',
    );
    expect(element.querySelector('[data-role="role-badge"]')).toBeNull();
    expect(element.querySelectorAll('app-sign-out-panel p')).toHaveLength(1);
  });

  it('signs out to the merchant tab of the login page', () => {
    const { element, signOut, navigate } = render();

    const button = Array.from(element.querySelectorAll('button')).find(
      (candidate) => candidate.textContent?.trim() === 'تسجيل الخروج',
    ) as HTMLButtonElement;
    button.click();

    expect(signOut).toHaveBeenCalledOnce();
    expect(navigate).toHaveBeenCalledWith('/login?role=merchant');
  });
});
