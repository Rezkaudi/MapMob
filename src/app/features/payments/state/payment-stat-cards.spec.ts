import { PaymentSummary } from '../models/payment-summary';
import { buildPaymentStatCards } from './payment-stat-cards';

const SUMMARY: PaymentSummary = {
  pendingCount: 20,
  transactionCount: 400,
  monthTotal: 200,
  cumulativeTotal: 1200,
};

describe('buildPaymentStatCards', () => {
  it('builds the four cards right to left as the design draws them, money with a $ sign', () => {
    expect(buildPaymentStatCards(SUMMARY)).toEqual([
      { label: 'إجمالي المدفعوعات التراكمية', value: '$1200', icon: 'payments' },
      { label: 'مدفوعات هذا الشهر', value: '200$', icon: 'payments' },
      { label: 'عدد عمليات الدفع', value: '400', icon: 'payments' },
      { label: 'المدفوعات قيد المتابعة', value: '20', icon: 'payments' },
    ]);
  });

  it('shows zeros before the summary has loaded', () => {
    expect(buildPaymentStatCards(null).map((card) => card.value)).toEqual([
      '$0',
      '0$',
      '0',
      '0',
    ]);
  });
});
