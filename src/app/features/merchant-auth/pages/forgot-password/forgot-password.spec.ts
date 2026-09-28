import { of } from 'rxjs';
import { renderMerchantAuthPage } from '../merchant-auth-page-testing';
import { ForgotPassword } from './forgot-password';

describe('ForgotPassword', () => {
  it('shows the copy from the design, with a way back to the login', () => {
    const { element } = renderMerchantAuthPage(ForgotPassword);

    expect(element.querySelector('h1')!.textContent!.trim()).toBe('نسيت كلمة المرور؟');
    expect(element.textContent).toContain(
      'لا تقلق ،أدخل البريد الإلكتروني المرتبط بحسابك، وسنرسل رمز تحقق إلى بريدك الإلكتروني.',
    );
    expect(element.querySelector('label')!.textContent!.trim()).toBe('البريد الالكتروني');
    expect(element.querySelector('a')!.getAttribute('href')).toBe('/login?role=merchant');
    expect(element.querySelector('button[type="submit"]')!.textContent!.trim()).toBe(
      'إرسال رمز التحقق',
    );
  });

  it('refuses an address that is not an email', async () => {
    const page = renderMerchantAuthPage(ForgotPassword, { sendResetCode: () => of(undefined) });

    page.type('#email', 'not-an-email');
    await page.submit();

    expect(page.currentPath()).toBe('');
    expect(page.element.querySelector('[role="alert"]')!.textContent!.trim()).toBe(
      'أدخل بريداً إلكترونياً صحيحاً',
    );
  });

  it('sends the code and moves to the code step', async () => {
    const sentTo: string[] = [];
    const page = renderMerchantAuthPage(ForgotPassword, {
      sendResetCode: (email: string) => {
        sentTo.push(email);
        return of(undefined);
      },
    });

    page.type('#email', 'merchant@mapmob.com');
    await page.submit();

    expect(sentTo).toEqual(['merchant@mapmob.com']);
    expect(page.currentPath()).toBe('/merchant/reset-code');
  });
});
