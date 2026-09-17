import { TestBed } from '@angular/core/testing';
import { PaymentMethodDialogState } from '../../models/payment-method-dialog-state';
import { PaymentMethodDraft } from '../../models/payment-method-draft';
import { buildPaymentMethod } from '../../testing/settings-fixture';
import { PaymentMethodDialog } from './payment-method-dialog';

function render(dialog: PaymentMethodDialogState) {
  const fixture = TestBed.createComponent(PaymentMethodDialog);
  fixture.componentRef.setInput('dialog', dialog);
  const saved: PaymentMethodDraft[] = [];
  fixture.componentInstance.saved.subscribe((draft) => saved.push(draft));
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, saved };
}

function submit(element: HTMLElement): void {
  (element.querySelector('button[type="submit"]') as HTMLButtonElement).click();
}

describe('PaymentMethodDialog', () => {
  it('adds a manual, active method by default', () => {
    const { element, saved } = render({ mode: 'add' });
    const name = element.querySelector('#payment-method-name') as HTMLInputElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('إضافة بوابة دفع');
    name.value = ' تحويل بنكي ';
    name.dispatchEvent(new Event('input'));
    submit(element);

    expect(saved).toEqual([{ name: 'تحويل بنكي', kind: 'manual', status: 'active' }]);
  });

  it('opens an edit with the method values', () => {
    const { element, saved } = render({
      mode: 'edit',
      method: buildPaymentMethod({ kind: 'electronic' }),
    });

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('تعديل بوابة الدفع');
    expect((element.querySelector('#payment-method-name') as HTMLInputElement).value).toBe(
      'دفع نقدي',
    );
    submit(element);

    expect(saved).toEqual([{ name: 'دفع نقدي', kind: 'electronic', status: 'active' }]);
  });

  it('needs a name', () => {
    const { fixture, element, saved } = render({ mode: 'add' });

    submit(element);
    fixture.detectChanges();

    expect(saved).toEqual([]);
    expect(element.textContent).toContain('اكتب اسم وسيلة الدفع');
  });
});
