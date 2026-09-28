import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NEVER, of, throwError } from 'rxjs';
import { MERCHANT_SUPPORT_URL } from '../../../../core/config/merchant-support-url';
import { AuthRepository } from '../../../auth/data/auth.repository';
import { AuthStore } from '../../../auth/state/auth.store';
import { MerchantAuthRepository } from '../../data/merchant-auth.repository';
import { MerchantSignInForm } from './merchant-sign-in-form';

const SUPPORT_URL = 'mailto:help@example.com';
const MERCHANT = { id: 'm-1', name: 'أحمد', role: 'owner', avatarUrl: null, token: 't' };

function render(repository: Partial<MerchantAuthRepository> = {}) {
  localStorage.clear();
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: AuthRepository, useValue: {} },
      { provide: MerchantAuthRepository, useValue: repository },
      { provide: MERCHANT_SUPPORT_URL, useValue: SUPPORT_URL },
    ],
  });
  const fixture = TestBed.createComponent(MerchantSignInForm);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  const type = (selector: string, value: string) => {
    const input = element.querySelector<HTMLInputElement>(selector)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };
  const submit = () => {
    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    fixture.detectChanges();
  };
  return { element, type, submit };
}

describe('MerchantSignInForm', () => {
  it('shows the merchant copy from the design', () => {
    const { element } = render();

    expect(element.querySelector('h1')!.textContent!.trim()).toBe('أهلاً بعودتك');
    expect(element.textContent).toContain(
      'أدخل بيانات حسابك المعتمدة من إدارة MapMob للوصول للوحة إدارة متجرك',
    );
    expect(element.textContent).toContain(
      'يتم تزويد بيانات الدخول حصرياً عن طريق مشرف المنصة بعد اعتماد النشاط',
    );
  });

  it('links "نسيت كلمة المرور؟" to the reset flow, right under the password box', () => {
    const { element } = render();

    const link = [...element.querySelectorAll('a')].find(
      (anchor) => anchor.textContent!.trim() === 'نسيت كلمة المرور؟',
    )!;
    expect(link.getAttribute('href')).toBe('/merchant/forgot-password');
    expect(link.previousElementSibling!.tagName).toBe('APP-AUTH-PASSWORD-FIELD');
  });

  it('asks first, then offers the contact link with its icon on the left', () => {
    const { element } = render();

    const contact = element.querySelector<HTMLAnchorElement>(`a[href="${SUPPORT_URL}"]`)!;
    expect(contact.textContent!.trim()).toBe('تواصل مع إدارة MapMob');
    expect(contact.previousElementSibling!.textContent!.trim()).toBe('ليس لديك بيانات الدخول؟');
    expect([...contact.children].at(-1)!.tagName).toBe('APP-ICON');
  });

  it('signs the merchant in through the shared session', () => {
    const { type, submit } = render({ signIn: () => of(MERCHANT) });

    type('#email', 'merchant@merchant.com');
    type('#password', 'merchant');
    submit();

    expect(TestBed.inject(AuthStore).isMerchant()).toBe(true);
  });

  it('says what is missing instead of calling the API', () => {
    let calls = 0;
    const { element, submit } = render({
      signIn: () => {
        calls++;
        return NEVER;
      },
    });

    submit();

    expect(calls).toBe(0);
    expect(element.querySelector('[role="alert"]')!.textContent!.trim()).toBe(
      'أدخل البريد الإلكتروني وكلمة المرور',
    );
  });

  it('shows the error from the API', () => {
    const { element, type, submit } = render({
      signIn: () => throwError(() => new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة')),
    });

    type('#email', 'merchant@merchant.com');
    type('#password', 'wrong');
    submit();

    expect(element.querySelector('[role="alert"]')!.textContent!.trim()).toBe(
      'البريد الإلكتروني أو كلمة المرور غير صحيحة',
    );
  });
});
