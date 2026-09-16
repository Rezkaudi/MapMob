import { summarizePayments } from './summarize-payments';

const TODAY = '2026-09-20';

function payment(amount: number, currency: 'USD' | 'SYP', paymentMethod: 'cash' | 'other', paidAt: string) {
  return { amount, currency, paymentMethod, paidAt };
}

describe('summarizePayments', () => {
  it('counts transactions and payments still awaiting follow-up', () => {
    const summary = summarizePayments(
      [
        payment(10, 'USD', 'cash', TODAY),
        payment(20, 'USD', 'other', TODAY),
        payment(30, 'SYP', 'other', TODAY),
      ],
      TODAY,
    );

    expect(summary.transactionCount).toBe(3);
    expect(summary.pendingCount).toBe(2);
  });

  it('totals only the USD amounts, this month and overall', () => {
    const summary = summarizePayments(
      [
        payment(10, 'USD', 'cash', TODAY),
        payment(20, 'USD', 'cash', '2026-07-01'),
        payment(30, 'SYP', 'cash', TODAY),
      ],
      TODAY,
    );

    expect(summary.monthTotal).toBe(10);
    expect(summary.cumulativeTotal).toBe(30);
  });
});
