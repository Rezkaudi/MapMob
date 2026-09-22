import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { PaymentRepository } from '../../data/payment.repository';
import { PaymentFormOptions } from '../../models/payment-form-options';
import { NewPaymentStore } from '../../state/new-payment.store';
import { NewPaymentDialog } from './new-payment-dialog';

const OPTIONS: PaymentFormOptions = {
  merchants: [
    {
      id: 'place-1',
      name: 'صيدلية الحياة',
      currentPlanId: 'basic',
      currentPlanName: 'الباقة الأساسية',
      subscriptionEndsOn: '2026-08-17',
      currency: 'SYP',
    },
  ],
  plans: [
    { id: 'basic', name: 'الباقة الأساسية', monthlyPrice: 150000, yearlyPrice: 1440000 },
    { id: 'featured', name: 'الباقة المميزة', monthlyPrice: 300000, yearlyPrice: 2880000 },
  ],
};

async function render() {
  TestBed.configureTestingModule({
    providers: [
      NewPaymentStore,
      {
        provide: PaymentRepository,
        useValue: {
          getPaymentFormOptions: (): Observable<PaymentFormOptions> => of(OPTIONS),
          createPayment: () => of({} as never),
        } as unknown as PaymentRepository,
      },
      { provide: CLOCK, useValue: () => new Date('2026-09-17T10:00:00Z') },
    ],
  });
  const store = TestBed.inject(NewPaymentStore);
  await store.open();
  const fixture = TestBed.createComponent(NewPaymentDialog);
  fixture.detectChanges();
  return { fixture, store, element: fixture.nativeElement as HTMLElement };
}

function textOf(element: HTMLElement): string {
  return element.textContent ?? '';
}

describe('NewPaymentDialog', () => {
  it('titles the card and lists the three payment kinds', async () => {
    const { element } = await render();

    expect(textOf(element)).toContain('إضافة دفعة جديدة');
    expect(textOf(element)).toContain('سجّل دفعة نقدية تم استلامها من أحد التجار وتفعيل الخدمة فورياً.');
    const kinds = element.querySelectorAll('[data-testid="payment-kind"] button');
    expect(Array.from(kinds).map((kind) => kind.textContent?.trim())).toEqual([
      'اشتراك جديد',
      'ترقية باقة',
      'تجديد اشتراك',
    ]);
  });

  it('starts on a new subscription, so it draws a plan select and no running subscription', async () => {
    const { element } = await render();

    expect(element.querySelector('[data-testid="payment-plan-select"]')).not.toBeNull();
    expect(element.querySelector('app-current-subscription-card')).toBeNull();
  });

  it('swaps the plan select for a read-only box once the kind is a renewal', async () => {
    const { fixture, store, element } = await render();

    store.setKind('renewal');
    fixture.detectChanges();

    expect(element.querySelector('[data-testid="payment-plan-select"]')).toBeNull();
    expect(element.querySelector('app-current-subscription-card')).not.toBeNull();
    expect(textOf(element)).toContain('الباقة الأساسية');
  });

  it('fills the amount from the plan and shows the merchant currency', async () => {
    const { element } = await render();
    const amount = element.querySelector('[data-testid="payment-amount"]') as HTMLInputElement;

    expect(amount.value).toBe('150,000');
    expect(textOf(element)).toContain('ل.س');
  });

  it('keeps the currency chip on the left of the amount, as the design draws it', async () => {
    const { element } = await render();
    const chip = element.querySelector('[data-testid="payment-currency"]');

    expect(chip?.className).toContain('end-[13px]');
  });

  it('puts the chevron on the right of the currency inside the chip', async () => {
    const { element } = await render();
    const chip = element.querySelector('[data-testid="payment-currency"]') as HTMLElement;
    const parts = Array.from(chip.children).map((part) => part.tagName.toLowerCase());

    // RTL renders the first child rightmost, so the icon leads and the currency follows.
    expect(parts).toEqual(['app-icon', 'span']);
    expect(chip.children[1].textContent?.trim()).toBe('ل.س');
  });

  it('right-aligns each window date under its label, as the design stacks them', async () => {
    const { element } = await render();
    const dates = Array.from(element.querySelectorAll('[data-testid="window-date"]'));

    // `dir="ltr"` keeps the digits in order but would otherwise pull the text to the left.
    expect(dates).toHaveLength(2);
    for (const date of dates) {
      expect(date.className).toContain('text-right');
    }
  });

  it('works the subscription window out and says so', async () => {
    const { element } = await render();

    expect(textOf(element)).toContain('17/09/2026');
    expect(textOf(element)).toContain('17/10/2026');
    expect(textOf(element)).toContain('يبدأ الاشتراك فورياً من تاريخ استلام الدفعة اليوم.');
  });

  it('records the payment from its footer', async () => {
    const { fixture, store, element } = await render();
    const submit = vi.spyOn(store, 'submit');

    (element.querySelector('[data-testid="payment-submit"]') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(submit).toHaveBeenCalledOnce();
  });

  it('closes from its cancel button', async () => {
    const { store, element } = await render();

    (element.querySelector('[data-testid="payment-cancel"]') as HTMLButtonElement).click();

    expect(store.isOpen()).toBe(false);
  });
});
