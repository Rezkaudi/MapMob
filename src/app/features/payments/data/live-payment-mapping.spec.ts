import {
  LIVE_PAYMENT,
  LIVE_PAYMENT_STORE,
  LIVE_PAYMENT_SUBSCRIPTION,
} from '../testing/live-payment-fixture';
import { LIVE_GOLD_PLAN } from '../../../shared/testing/live-plan-fixture';
import {
  toLivePaymentBody,
  toLiveSubscriptionBody,
  toPayment,
  toPaymentDetail,
  toPaymentFormOptions,
} from './live-payment-mapping';

const DRAFT = {
  merchantId: '1',
  kind: 'new' as const,
  planId: '1',
  term: 'monthly' as const,
  amount: 25,
  currency: 'USD' as const,
  paidAt: '2026-10-14',
  startsOn: '2026-10-14',
  endsOn: '2026-11-13',
  notes: 'نقداً',
};

describe('live payment mapping', () => {
  it('reads a payment row', () => {
    expect(toPayment(LIVE_PAYMENT)).toEqual({
      id: '1',
      transactionNumber: '#PAY-1',
      receiptNumber: '986hmk56',
      companyName: 'متجر دمشق',
      amount: 25,
      currency: 'USD',
      paymentMethod: 'cash',
      paidAt: '2026-10-13',
      notes: 'تم القبض',
    });
  });

  it('reads any method other than cash as other, and a missing pay day as the record day', () => {
    const payment = toPayment({ ...LIVE_PAYMENT, payment_method: 'bank_transfer', paid_at: null });

    expect(payment.paymentMethod).toBe('other');
    expect(payment.paidAt).toBe('2026-10-13');
  });

  it('fills the company and subscription cards from the store and the subscription', () => {
    const detail = toPaymentDetail(LIVE_PAYMENT, LIVE_PAYMENT_STORE, LIVE_PAYMENT_SUBSCRIPTION);

    expect(detail.company).toEqual({
      name: 'متجر دمشق',
      type: 'مطاعم',
      contactName: 'أحمد',
      contactPhone: '0931234567',
    });
    expect(detail.subscription).toEqual({
      planName: 'الباقة الذهبية',
      cycle: 'شهري',
      startsOn: '2026-10-04',
      endsOn: '2026-11-03',
    });
  });

  it('leaves the cards short when the store or the subscription cannot be read', () => {
    const detail = toPaymentDetail(LIVE_PAYMENT, null, null);

    expect(detail.company.type).toBe('');
    expect(detail.subscription).toBeNull();
  });

  it('offers every store with its running plan, and every plan at its price', () => {
    const options = toPaymentFormOptions(
      [
        { id: '1', name: 'متجر دمشق' },
        { id: '4', name: 'متجر حلب' },
      ],
      [LIVE_PAYMENT_SUBSCRIPTION],
      [LIVE_GOLD_PLAN],
    );

    expect(options.merchants).toEqual([
      {
        id: '1',
        name: 'متجر دمشق',
        currentPlanId: '1',
        currentPlanName: 'الباقة الذهبية',
        subscriptionEndsOn: '2026-11-03',
        currency: 'SYP',
      },
      {
        id: '4',
        name: 'متجر حلب',
        currentPlanId: null,
        currentPlanName: null,
        subscriptionEndsOn: null,
        currency: 'SYP',
      },
    ]);
    expect(options.plans).toEqual([
      { id: '1', name: 'الباقة الذهبية', monthlyPrice: 150000, yearlyPrice: null },
    ]);
  });

  it('writes the subscription the payment pays for, over the picked days', () => {
    expect(toLiveSubscriptionBody(DRAFT)).toEqual({
      store_id: '1',
      plan_id: '1',
      starts_at: '2026-10-14 00:00:00',
      ends_at: '2026-11-13 23:59:59',
      status: 'active',
      auto_renew: false,
    });
  });

  it('writes a paid cash payment tied to that subscription', () => {
    expect(toLivePaymentBody(DRAFT, 9)).toEqual({
      store_id: '1',
      subscription_id: 9,
      amount: 25,
      currency_code: 'USD',
      paid_at: '2026-10-14',
      payment_method: 'cash',
      status: 'paid',
      notes: 'نقداً',
    });
  });
});
