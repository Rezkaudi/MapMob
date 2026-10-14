import { LIVE_PAYMENT } from '../testing/live-payment-fixture';
import { summarizeLivePayments } from './summarize-live-payments';

describe('summarizeLivePayments', () => {
  it('counts every payment, the pending ones, and the paid dollars this month and in all', () => {
    const summary = summarizeLivePayments(
      [
        LIVE_PAYMENT,
        { ...LIVE_PAYMENT, id: 2, paid_at: '2026-09-01T00:00:00Z', amount: '10.00' },
        { ...LIVE_PAYMENT, id: 3, status: 'pending', amount: '99.00' },
        { ...LIVE_PAYMENT, id: 4, currency_code: 'SYP', amount: '5000.00' },
      ],
      '2026-10-14',
    );

    expect(summary).toEqual({
      transactionCount: 4,
      pendingCount: 1,
      monthTotal: 25,
      cumulativeTotal: 35,
    });
  });
});
