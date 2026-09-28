import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { MerchantAuthStore } from '../../state/merchant-auth.store';
import { renderMerchantAuthPage } from '../merchant-auth-page-testing';
import { NewPasswordPage } from './new-password';

describe('NewPasswordPage', () => {
  it('shows the copy from the design with both labels on the right edge', () => {
    const { element } = renderMerchantAuthPage(NewPasswordPage);

    expect(element.querySelector('h1')!.textContent!.trim()).toBe('إنشاء كلمة مرور جديدة');
    expect(element.textContent).toContain('أدخل كلمة المرور الجديدة لحسابك.');
    const labels = [...element.querySelectorAll('label')];
    expect(labels.map((label) => label.textContent!.trim())).toEqual([
      'كلمة المرور الجديدة',
      'تأكيد كلمة المرور',
    ]);
    expect(element.querySelector('a')).toBeNull();
    expect(element.querySelector('button[type="submit"]')!.textContent!.trim()).toBe(
      'تحديث كلمة المرور',
    );
  });

  it('refuses a short password', async () => {
    const page = renderMerchantAuthPage(NewPasswordPage);

    page.type('#new-password', 'short');
    page.type('#password-confirmation', 'short');
    await page.submit();

    expect(page.element.querySelector('[role="alert"]')!.textContent!.trim()).toBe(
      'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل',
    );
  });

  it('refuses two passwords that differ', async () => {
    const page = renderMerchantAuthPage(NewPasswordPage);

    page.type('#new-password', 'new-secret-1');
    page.type('#password-confirmation', 'new-secret-2');
    await page.submit();

    expect(page.element.querySelector('[role="alert"]')!.textContent!.trim()).toBe(
      'كلمتا المرور غير متطابقتين',
    );
  });

  it('saves the password and returns to the login', async () => {
    const saved: string[] = [];
    const page = renderMerchantAuthPage(NewPasswordPage, {
      sendResetCode: () => of(undefined),
      verifyResetCode: () => of({ resetToken: 'reset-1' }),
      resetPassword: ({ password }) => {
        saved.push(password);
        return of(undefined);
      },
    });
    const store = TestBed.inject(MerchantAuthStore);
    store.sendResetCode('merchant@mapmob.com');
    store.verifyResetCode('123456');

    page.type('#new-password', 'new-secret-1');
    page.type('#password-confirmation', 'new-secret-1');
    await page.submit();

    expect(saved).toEqual(['new-secret-1']);
    expect(page.currentPath()).toBe('/login?role=merchant');
  });
});
