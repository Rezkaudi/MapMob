import { PaymentMerchant } from '../models/payment-merchant';
import { PaymentPlan } from '../models/payment-plan';
import { buildPaymentPlanField } from './payment-plan-field';

const PLANS: readonly PaymentPlan[] = [
  { id: 'free', name: 'الباقة المجانية', monthlyPrice: 0, yearlyPrice: null },
  { id: 'basic', name: 'الباقة الأساسية', monthlyPrice: 100000, yearlyPrice: 960000 },
  { id: 'featured', name: 'الباقة المميزة', monthlyPrice: 300000, yearlyPrice: 2880000 },
];

function merchant(patch: Partial<PaymentMerchant> = {}): PaymentMerchant {
  return {
    id: 'place-1',
    name: 'صيدلية الحياة',
    currentPlanId: 'basic',
    currentPlanName: 'الباقة الأساسية',
    subscriptionEndsOn: '2026-08-17',
    currency: 'SYP',
    ...patch,
  };
}

describe('buildPaymentPlanField', () => {
  it('lets a new subscription pick any plan', () => {
    const field = buildPaymentPlanField('new', merchant(), PLANS, 'featured');

    expect(field).toEqual({
      label: 'الباقة',
      isRequired: true,
      isSelectable: true,
      planId: 'featured',
      planName: 'الباقة المميزة',
    });
  });

  it('falls back to the first plan when a new subscription has none picked yet', () => {
    expect(buildPaymentPlanField('new', merchant(), PLANS, null).planId).toBe('free');
  });

  it('moves an upgrade to the plan above the one the merchant holds, and shows it read only', () => {
    const field = buildPaymentPlanField('upgrade', merchant(), PLANS, null);

    expect(field).toEqual({
      label: 'الباقة الجديدة',
      isRequired: false,
      isSelectable: false,
      planId: 'featured',
      planName: 'الباقة المميزة',
    });
  });

  it('keeps an upgrade on the top plan when the merchant already holds it', () => {
    const top = merchant({ currentPlanId: 'featured', currentPlanName: 'الباقة المميزة' });

    expect(buildPaymentPlanField('upgrade', top, PLANS, null).planId).toBe('featured');
  });

  it('keeps a renewal on the plan the merchant holds, and shows it read only', () => {
    const field = buildPaymentPlanField('renewal', merchant(), PLANS, null);

    expect(field).toEqual({
      label: 'الباقة',
      isRequired: false,
      isSelectable: false,
      planId: 'basic',
      planName: 'الباقة الأساسية',
    });
  });

  it('is empty while no merchant is picked', () => {
    const field = buildPaymentPlanField('renewal', null, PLANS, null);

    expect(field.planId).toBeNull();
    expect(field.planName).toBe('');
  });
});
