import { NO_PAYMENT_FILTERS } from '../models/payment-filters';
import { countActivePaymentFilters } from './count-active-payment-filters';

describe('countActivePaymentFilters', () => {
  it('counts nothing when every filter is "الكل"', () => {
    expect(countActivePaymentFilters(NO_PAYMENT_FILTERS)).toBe(0);
  });

  it('counts the company name, the method, the currency and the date range', () => {
    expect(
      countActivePaymentFilters({ ...NO_PAYMENT_FILTERS, companyName: 'الحياة' }),
    ).toBe(1);
    expect(
      countActivePaymentFilters({ ...NO_PAYMENT_FILTERS, paymentMethod: 'cash' }),
    ).toBe(1);
    expect(countActivePaymentFilters({ ...NO_PAYMENT_FILTERS, currency: 'USD' })).toBe(1);
    expect(
      countActivePaymentFilters({
        ...NO_PAYMENT_FILTERS,
        paidOn: { from: '2026-08-01', to: null },
      }),
    ).toBe(1);
    expect(
      countActivePaymentFilters({
        companyName: 'الحياة',
        paymentMethod: 'cash',
        currency: 'USD',
        paidOn: { from: '2026-08-01', to: '2026-09-02' },
      }),
    ).toBe(4);
  });
});
