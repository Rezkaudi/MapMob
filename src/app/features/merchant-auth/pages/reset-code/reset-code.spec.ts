import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { MerchantAuthStore } from '../../state/merchant-auth.store';
import { renderMerchantAuthPage } from '../merchant-auth-page-testing';
import { ResetCode } from './reset-code';

function typeCode(element: HTMLElement, code: string) {
  const firstBox = element.querySelector<HTMLInputElement>('app-reset-code-field input')!;
  firstBox.value = code;
  firstBox.dispatchEvent(new Event('input'));
}

describe('ResetCode', () => {
  it('shows the copy from the design and names the boxes by their label', () => {
    const { element } = renderMerchantAuthPage(ResetCode);

    expect(element.querySelector('h1')!.textContent!.trim()).toBe('رمز التحقق');
    expect(element.textContent).toContain(
      'أرسلنا رمز تحقق مكونًا من 6 أرقام إلى بريدك الإلكتروني.',
    );
    const label = element.querySelector('#reset-code-label')!;
    expect(label.textContent!.trim()).toBe('أدخل الرمز');
    expect(label.parentElement!.classList).toContain('items-start');
    expect(element.querySelector('button[type="submit"]')!.textContent!.trim()).toBe('تأكيد الرمز');
  });

  it('asks the question first, then offers the resend button', () => {
    const { element } = renderMerchantAuthPage(ResetCode);

    const resend = [...element.querySelectorAll('button')].find(
      (button) => button.textContent!.trim() === 'إعادة إرسال',
    )!;
    expect(resend.type).toBe('button');
    expect(resend.parentElement!.textContent!.trim().startsWith('لم يتم إرسال الرمز؟')).toBe(true);
  });

  it('resends the code to the same email', () => {
    const sentTo: string[] = [];
    const page = renderMerchantAuthPage(ResetCode, {
      sendResetCode: (email: string) => {
        sentTo.push(email);
        return of(undefined);
      },
    });
    TestBed.inject(MerchantAuthStore).sendResetCode('merchant@mapmob.com');

    [...page.element.querySelectorAll('button')]
      .find((button) => button.textContent!.trim() === 'إعادة إرسال')!
      .click();

    expect(sentTo).toEqual(['merchant@mapmob.com', 'merchant@mapmob.com']);
  });

  it('says the code is incomplete instead of calling the API', async () => {
    let calls = 0;
    const page = renderMerchantAuthPage(ResetCode, {
      verifyResetCode: () => {
        calls++;
        return of({ resetToken: 'x' });
      },
    });

    typeCode(page.element, '123');
    await page.submit();

    expect(calls).toBe(0);
    expect(page.element.querySelector('[role="alert"]')!.textContent!.trim()).toBe(
      'أدخل الرمز المكون من 6 أرقام',
    );
  });

  it('moves to the new password step once the code checks out', async () => {
    const page = renderMerchantAuthPage(ResetCode, {
      sendResetCode: () => of(undefined),
      verifyResetCode: () => of({ resetToken: 'reset-1' }),
    });
    TestBed.inject(MerchantAuthStore).sendResetCode('merchant@mapmob.com');

    typeCode(page.element, '123456');
    await page.submit();

    expect(page.currentPath()).toBe('/merchant/new-password');
  });

  it('shows the API error for a wrong code', async () => {
    const page = renderMerchantAuthPage(ResetCode, {
      verifyResetCode: () => throwError(() => new Error('رمز التحقق غير صحيح')),
    });

    typeCode(page.element, '000000');
    await page.submit();

    expect(page.element.querySelector('[role="alert"]')!.textContent!.trim()).toBe(
      'رمز التحقق غير صحيح',
    );
  });
});
