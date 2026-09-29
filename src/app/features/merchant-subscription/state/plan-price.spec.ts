import { BASIC_PLAN } from '../testing/merchant-subscription-fixture';
import { priceForCycle } from './plan-price';

describe('plan price', () => {
  it('takes the monthly price for the monthly cycle', () => {
    expect(priceForCycle(BASIC_PLAN, 'monthly')).toEqual({ amount: 150000, term: 'monthly' });
  });

  it('takes the discounted yearly price for the yearly cycle', () => {
    expect(priceForCycle(BASIC_PLAN, 'yearly')).toEqual({ amount: 1440000, term: 'yearly' });
  });

  it('falls back to monthly when the plan has no yearly price', () => {
    const plan = { ...BASIC_PLAN, yearlyPrice: null };

    expect(priceForCycle(plan, 'yearly')).toEqual({ amount: 150000, term: 'monthly' });
  });
});
