import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { PaymentRepository } from '../data/payment.repository';
import { NewPaymentDraft } from '../models/new-payment-draft';
import { PaymentFormOptions } from '../models/payment-form-options';
import { NewPaymentStore } from './new-payment.store';

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
    {
      id: 'place-2',
      name: 'مطعم الأصالة',
      currentPlanId: null,
      currentPlanName: null,
      subscriptionEndsOn: null,
      currency: 'SYP',
    },
  ],
  plans: [
    { id: 'free', name: 'الباقة المجانية', monthlyPrice: 0, yearlyPrice: null },
    { id: 'basic', name: 'الباقة الأساسية', monthlyPrice: 150000, yearlyPrice: 1440000 },
    { id: 'featured', name: 'الباقة المميزة', monthlyPrice: 300000, yearlyPrice: 2880000 },
  ],
};

function setUp(overrides: Partial<PaymentRepository> = {}) {
  const created: NewPaymentDraft[] = [];
  const repository = {
    getPaymentFormOptions: (): Observable<PaymentFormOptions> => of(OPTIONS),
    createPayment: (draft: NewPaymentDraft) => {
      created.push(draft);
      return of({} as never);
    },
    ...overrides,
  } as PaymentRepository;
  TestBed.configureTestingModule({
    providers: [
      NewPaymentStore,
      { provide: PaymentRepository, useValue: repository },
      { provide: CLOCK, useValue: () => new Date('2026-09-17T10:00:00Z') },
    ],
  });
  return { store: TestBed.inject(NewPaymentStore), created };
}

describe('NewPaymentStore', () => {
  it('starts closed', () => {
    expect(setUp().store.isOpen()).toBe(false);
  });

  it('opens on the first merchant, a new subscription and today', async () => {
    const { store } = setUp();

    await store.open();

    expect(store.isOpen()).toBe(true);
    expect(store.merchantId()).toBe('place-1');
    expect(store.kind()).toBe('new');
    expect(store.paidAt()).toBe('2026-09-17');
    expect(store.term()).toBe('monthly');
  });

  it('works out the subscription window from the pay date and the term', async () => {
    const { store } = setUp();
    await store.open();

    expect(store.window()).toEqual({ startsOn: '2026-09-17', endsOn: '2026-10-17' });

    store.setTerm('yearly');

    expect(store.window()).toEqual({ startsOn: '2026-09-17', endsOn: '2027-09-17' });
  });

  it('prices the picked plan for the picked term', async () => {
    const { store } = setUp();
    await store.open();

    store.setPlanId('featured');
    expect(store.amount()).toBe(300000);

    store.setTerm('yearly');
    expect(store.amount()).toBe(2880000);
  });

  it('keeps an amount the admin typed over the plan price', async () => {
    const { store } = setUp();
    await store.open();

    store.setAmount(90000);

    expect(store.amount()).toBe(90000);
  });

  it('shows the running subscription once the kind is a renewal', async () => {
    const { store } = setUp();
    await store.open();

    store.setKind('renewal');

    expect(store.currentSubscription()).toEqual({
      planName: 'الباقة الأساسية',
      endsOn: '2026-08-17',
    });
    expect(store.planField().planName).toBe('الباقة الأساسية');
  });

  it('has no running subscription to show for a new one', async () => {
    const { store } = setUp();
    await store.open();

    expect(store.currentSubscription()).toBeNull();
  });

  it('will not save while the merchant has no plan to renew', async () => {
    const { store } = setUp();
    await store.open();

    store.setMerchantId('place-2');
    store.setKind('renewal');

    expect(store.canSubmit()).toBe(false);
  });

  it('sends the whole draft and closes', async () => {
    const { store, created } = setUp();
    await store.open();
    store.setPlanId('basic');
    store.setNotes('دفعة نقدية');

    await store.submit();

    expect(created).toEqual([
      {
        merchantId: 'place-1',
        kind: 'new',
        planId: 'basic',
        term: 'monthly',
        amount: 150000,
        currency: 'SYP',
        paidAt: '2026-09-17',
        startsOn: '2026-09-17',
        endsOn: '2026-10-17',
        notes: 'دفعة نقدية',
      },
    ]);
    expect(store.isOpen()).toBe(false);
  });

  it('stays open and reports why when saving fails', async () => {
    const { store } = setUp({
      createPayment: () => throwError(() => new Error('تعذر تسجيل الدفعة')),
    });
    await store.open();

    await store.submit();

    expect(store.saveError()).toBe('تعذر تسجيل الدفعة');
    expect(store.isOpen()).toBe(true);
  });
});
