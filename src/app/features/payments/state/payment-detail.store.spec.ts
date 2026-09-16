import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { PaymentRepository } from '../data/payment.repository';
import { buildPaymentDetail } from '../testing/payment-fixture';
import { PaymentDetailStore } from './payment-detail.store';

const DETAIL = buildPaymentDetail();

function createStore(getPaymentDetail: PaymentRepository['getPaymentDetail']) {
  TestBed.configureTestingModule({
    providers: [
      PaymentDetailStore,
      { provide: PaymentRepository, useValue: { getPaymentDetail } },
    ],
  });
  return TestBed.inject(PaymentDetailStore);
}

describe('PaymentDetailStore', () => {
  it('opens a payment, loads it and closes again', () => {
    const store = createStore(() => of(DETAIL));

    store.open('payment-1');

    expect(store.isOpen()).toBe(true);
    expect(store.detail()).toEqual(DETAIL);
    expect(store.isLoading()).toBe(false);

    store.close();
    expect(store.isOpen()).toBe(false);
    expect(store.detail()).toBeNull();
  });

  it('keeps the error and loads the same payment again on retry', () => {
    let calls = 0;
    const store = createStore(() => {
      calls += 1;
      return calls === 1 ? throwError(() => new Error('تعذر تحميل الدفعة')) : of(DETAIL);
    });

    store.open('payment-1');
    expect(store.error()).toBe('تعذر تحميل الدفعة');

    store.reload();
    expect(store.detail()).toEqual(DETAIL);
  });
});
