import { buildPaymentDetail } from '../testing/payment-fixture';
import { filterPayments, queryPayments } from './payment-mock-query';

const PHARMACY = buildPaymentDetail({
  id: 'p1',
  transactionNumber: '#pay-1001',
  companyName: 'صيدلية الحياة',
  paymentMethod: 'cash',
  currency: 'USD',
  paidAt: '2026-08-01',
});
const RESTAURANT = buildPaymentDetail({
  id: 'p2',
  transactionNumber: '#pay-1002',
  companyName: 'مطعم الأصالة',
  paymentMethod: 'other',
  currency: 'SYP',
  paidAt: '2026-08-15',
});
const GYM = buildPaymentDetail({
  id: 'p3',
  transactionNumber: '#pay-1003',
  companyName: 'نادي القوة',
  paymentMethod: 'cash',
  currency: 'SYP',
  paidAt: '2026-09-02',
});
const PAYMENTS = [PHARMACY, RESTAURANT, GYM];
const FIRST_PAGE = { pageIndex: 0, pageSize: 4 };

describe('queryPayments', () => {
  it('pages the payments', () => {
    expect(queryPayments(PAYMENTS, { pageIndex: 0, pageSize: 2 }).items).toEqual([
      PHARMACY,
      RESTAURANT,
    ]);
    expect(queryPayments(PAYMENTS, { pageIndex: 0, pageSize: 2 }).totalCount).toBe(3);
  });

  it('searches the company name and the transaction number', () => {
    expect(queryPayments(PAYMENTS, { ...FIRST_PAGE, search: 'الحياة' }).items).toEqual([PHARMACY]);
    expect(queryPayments(PAYMENTS, { ...FIRST_PAGE, search: '1002' }).items).toEqual([RESTAURANT]);
  });

  it('filters by payment method and currency', () => {
    expect(
      queryPayments(PAYMENTS, { ...FIRST_PAGE, paymentMethod: 'other' }).items,
    ).toEqual([RESTAURANT]);
    expect(queryPayments(PAYMENTS, { ...FIRST_PAGE, currency: 'SYP' }).items).toEqual([
      RESTAURANT,
      GYM,
    ]);
  });

  it('keeps payments made inside the date range', () => {
    const paidOn = (from: string | null, to: string | null) =>
      queryPayments(PAYMENTS, { ...FIRST_PAGE, paidOn: { from, to } }).items;

    expect(paidOn('2026-08-10', null)).toEqual([RESTAURANT, GYM]);
    expect(paidOn(null, '2026-08-05')).toEqual([PHARMACY]);
    expect(paidOn('2026-08-01', '2026-08-01')).toEqual([PHARMACY]);
  });

  it('sorts by payment day', () => {
    const idsFor = (sort: 'newest' | 'oldest') =>
      queryPayments(PAYMENTS, { ...FIRST_PAGE, sort }).items.map((payment) => payment.id);

    expect(idsFor('newest')).toEqual(['p3', 'p2', 'p1']);
    expect(idsFor('oldest')).toEqual(['p1', 'p2', 'p3']);
  });
});

describe('filterPayments', () => {
  it('returns every match, not just one page', () => {
    expect(filterPayments(PAYMENTS, { pageIndex: 0, pageSize: 1 })).toHaveLength(3);
    expect(filterPayments(PAYMENTS, { pageIndex: 0, pageSize: 1, search: 'القوة' })).toEqual([
      GYM,
    ]);
  });
});
