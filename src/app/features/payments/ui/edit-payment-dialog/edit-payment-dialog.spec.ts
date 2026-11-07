import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { PaymentRepository } from '../../data/payment.repository';
import { PaymentChanges } from '../../models/payment-changes';
import { EditPaymentStore } from '../../state/edit-payment.store';
import { buildPaymentDetail } from '../../testing/payment-fixture';
import { EditPaymentDialog } from './edit-payment-dialog';

const PAYMENT = buildPaymentDetail({
  amount: 300000,
  currency: 'SYP',
  paidAt: '2026-10-01',
  notes: 'دفعة أولى',
});

function render(
  updatePayment: (id: string, changes: PaymentChanges) => Observable<unknown> = () => of(PAYMENT),
) {
  TestBed.configureTestingModule({
    providers: [EditPaymentStore, { provide: PaymentRepository, useValue: { updatePayment } }],
  });
  const store = TestBed.inject(EditPaymentStore);
  store.open(PAYMENT);
  const fixture = TestBed.createComponent(EditPaymentDialog);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  const field = <T extends HTMLElement>(testId: string): T =>
    element.querySelector(`[data-testid="${testId}"]`) as T;
  return { fixture, store, element, field };
}

function type(input: HTMLInputElement | HTMLTextAreaElement, value: string): void {
  input.value = value;
  input.dispatchEvent(new Event('input'));
}

describe('EditPaymentDialog', () => {
  it('titles the card and names the payment and its place, which cannot change here', () => {
    const { element, field } = render();

    expect(element.textContent).toContain('تعديل الدفعة');
    expect(field('payment-place').textContent?.trim()).toBe('صيدلية الحياة');
    expect(field('payment-number').textContent?.trim()).toBe('#pay-1024');
    expect(element.querySelectorAll('select:not([data-testid="currency-select"])')).toHaveLength(0);
  });

  it('opens filled with the payment as it is now', () => {
    const { field } = render();

    expect(field<HTMLInputElement>('payment-amount').value).toBe('300,000');
    expect(field<HTMLInputElement>('payment-paid-at').value).toBe('2026-10-01');
    expect(field<HTMLTextAreaElement>('payment-notes').value).toBe('دفعة أولى');
  });

  it('saves the typed changes', () => {
    const sent: PaymentChanges[] = [];
    const { fixture, field } = render((id, changes) => {
      sent.push(changes);
      return of(PAYMENT);
    });

    type(field('payment-amount'), '250,000');
    type(field('payment-paid-at'), '2026-10-03');
    type(field('payment-notes'), 'خصم');
    fixture.detectChanges();
    field<HTMLButtonElement>('payment-submit').click();

    expect(sent).toEqual([{ amount: 250000, currency: 'SYP', paidAt: '2026-10-03', notes: 'خصم' }]);
  });

  it('will not save an empty amount', () => {
    const { fixture, field } = render();

    type(field('payment-amount'), '');
    fixture.detectChanges();

    expect(field<HTMLButtonElement>('payment-submit').disabled).toBe(true);
  });

  it('closes on cancel without saving', () => {
    const updatePayment = vi.fn(() => of(PAYMENT));
    const { store, field } = render(updatePayment);

    field<HTMLButtonElement>('payment-cancel').click();

    expect(store.isOpen()).toBe(false);
    expect(updatePayment).not.toHaveBeenCalled();
  });

  it('says why the save failed and stays open', async () => {
    const { fixture, store, element } = render(() =>
      throwError(() => new Error('تعذر حفظ الدفعة')),
    );

    await store.submit();
    fixture.detectChanges();

    expect(store.isOpen()).toBe(true);
    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('تعذر حفظ الدفعة');
  });
});
