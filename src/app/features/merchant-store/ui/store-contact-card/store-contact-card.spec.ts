import { TestBed } from '@angular/core/testing';
import { NO_FIELD_ERRORS, buildFilledStoreForm } from '../../testing/store-form-fixture';
import { StoreContactCard } from './store-contact-card';

function render() {
  const form = buildFilledStoreForm();
  const fixture = TestBed.createComponent(StoreContactCard);
  fixture.componentRef.setInput('form', form);
  fixture.componentRef.setInput('errors', {
    ...NO_FIELD_ERRORS,
    email: 'أدخل بريداً إلكترونياً صحيحاً',
  });
  fixture.detectChanges();
  return { form, element: fixture.nativeElement as HTMLElement };
}

describe('StoreContactCard', () => {
  it('lays the six channels out right to left, row by row, as the frame does', () => {
    const { element } = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('معلومات التواصل');
    expect(
      [...element.querySelectorAll('app-store-field label')].map((label) =>
        label.textContent?.trim(),
      ),
    ).toEqual([
      'رقم الهاتف الأساسي',
      'البريد الإلكتروني التجاري',
      'رقم الواتساب',
      'رابط صفحة فيسبوك',
      'رابط صفحة الانستاغرام',
      'رابط صفحة التلغرام',
    ]);
  });

  it('writes every value left to right and binds it to the form', () => {
    const { element, form } = render();
    const inputs = [...element.querySelectorAll('input')] as HTMLInputElement[];

    expect(inputs.map((input) => input.value)).toEqual([
      '+963 944 123 456',
      'contact@alhayat-pharmacy.sy',
      '+963 944 123 456',
      'https://facebook.com/alhayatpharmacy',
      'https://instagram.com/alhayatpharmacy',
      'https://t.me/alhayatpharmacy',
    ]);
    expect(inputs.every((input) => input.getAttribute('dir') === 'ltr')).toBe(true);

    inputs[5].value = 'https://t.me/alhayat';
    inputs[5].dispatchEvent(new Event('input'));
    expect(form.controls.telegram.value).toBe('https://t.me/alhayat');
  });

  it('shows the error of a field under it', () => {
    const { element } = render();

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'أدخل بريداً إلكترونياً صحيحاً',
    );
  });
});
