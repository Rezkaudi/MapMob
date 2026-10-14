import { LIVE_GOLD_PLAN } from '../../../shared/testing/live-plan-fixture';
import { LivePayment } from '../data/live-payment';
import { LivePaymentStore } from '../data/live-payment-store';
import { LivePaymentSubscription } from '../data/live-payment-subscription';

export const LIVE_PAYMENT: LivePayment = {
  id: 1,
  store: { id: 1, name: 'متجر دمشق' },
  subscription_id: 1,
  amount: '25.00',
  currency_code: 'USD',
  paid_at: '2026-10-13T00:00:00.000000Z',
  payment_method: 'cash',
  receipt_number: '986hmk56',
  notes: 'تم القبض',
  status: 'paid',
  created_at: '2026-10-13T18:31:11.000000Z',
};

export const LIVE_PAYMENT_STORE: LivePaymentStore = {
  mainCategory: { name: 'مطاعم' },
  owner: { name: 'أحمد' },
  contact: { phone: '0931234567' },
};

export const LIVE_PAYMENT_SUBSCRIPTION: LivePaymentSubscription = {
  id: 1,
  store: { id: 1, name: 'متجر دمشق' },
  plan: LIVE_GOLD_PLAN,
  starts_at: '2026-10-04T00:00:00+00:00',
  ends_at: '2026-11-03T23:59:59+00:00',
  status: 'active',
};
