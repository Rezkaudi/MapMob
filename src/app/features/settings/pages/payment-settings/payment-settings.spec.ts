import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { PaymentMethodsRepository } from '../../data/payment-methods.repository';
import { buildPaymentMethod } from '../../testing/settings-fixture';
import { PaymentSettings } from './payment-settings';

function render() {
  const repository: Partial<PaymentMethodsRepository> = {
    getMethods: () => of([buildPaymentMethod()]),
    addMethod: (draft) => of({ id: 'payment-method-2', ...draft }),
    updateMethod: (id, draft) => of({ id, ...draft }),
  };
  TestBed.configureTestingModule({
    providers: [{ provide: PaymentMethodsRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(PaymentSettings);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

async function settle(fixture: { whenStable(): Promise<unknown>; detectChanges(): void }) {
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('PaymentSettings', () => {
  it('heads the section with the add button beside the title', () => {
    const { element } = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إعدادات الدفع');
    expect(element.textContent).toContain(
      'التحكم في بوابات الدفع الالكتروني والتحويل البنكي و رسوم الاشتراكات.',
    );
    expect(
      element
        .querySelector('app-settings-section-heading app-settings-add-button')
        ?.textContent?.trim(),
    ).toBe('إضافة بوابة دفع');
  });

  it('adds a method through the dialog and confirms it', async () => {
    const { fixture, element } = render();

    (element.querySelector('app-settings-add-button button') as HTMLButtonElement).click();
    fixture.detectChanges();
    const name = element.querySelector('#payment-method-name') as HTMLInputElement;
    name.value = 'تحويل بنكي';
    name.dispatchEvent(new Event('input'));
    (
      element.querySelector('app-payment-method-dialog button[type="submit"]') as HTMLButtonElement
    ).click();
    await settle(fixture);

    expect(element.querySelector('app-payment-method-dialog')).toBeNull();
    expect(element.querySelectorAll('tbody tr')).toHaveLength(2);
    expect(element.querySelector('app-toast')?.textContent).toContain('تمت إضافة بوابة الدفع');
  });

  it('opens the edit dialog from the pencil', () => {
    const { fixture, element } = render();

    (element.querySelector('button[aria-label="تعديل دفع نقدي"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(element.querySelector('app-payment-method-dialog h2')?.textContent?.trim()).toBe(
      'تعديل بوابة الدفع',
    );
  });
});
