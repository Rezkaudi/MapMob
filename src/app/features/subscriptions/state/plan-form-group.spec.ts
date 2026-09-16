import { describe, expect, it } from 'vitest';
import { MOCK_PLANS } from '../data/plan-mock-samples';
import { PackagePlan } from '../models/package-plan';
import { buildPlanFormGroup, toPlanDraft } from './plan-form-group';

const basic = MOCK_PLANS.find((plan) => plan.id === 'basic') as PackagePlan;

describe('buildPlanFormGroup', () => {
  it('fills the form from the package being edited', () => {
    const form = buildPlanFormGroup(basic);

    expect(form.controls.name.value).toBe('أساسية');
    expect(form.controls.monthlyPrice.value).toBe(20);
    expect(form.controls.yearlyPrice.value).toBe(192);
    expect(form.controls.isActive.value).toBe(true);
    expect(form.controls.features.length).toBe(4);
  });

  it('needs a name', () => {
    const form = buildPlanFormGroup(basic);

    form.controls.name.setValue('  ');

    expect(form.controls.name.valid).toBe(false);
  });

  it('refuses a negative price', () => {
    const form = buildPlanFormGroup(basic);

    form.controls.monthlyPrice.setValue(-1);

    expect(form.controls.monthlyPrice.valid).toBe(false);
  });

  it('refuses a negative limit', () => {
    const form = buildPlanFormGroup(basic);

    form.controls.limits.controls.adsPerMonth.setValue(-2);

    expect(form.controls.limits.controls.adsPerMonth.valid).toBe(false);
  });
});

describe('toPlanDraft', () => {
  it('reads the form back as a draft, trimming the text', () => {
    const form = buildPlanFormGroup(basic);
    form.controls.name.setValue('  الباقة الأساسية  ');

    const draft = toPlanDraft(form);

    expect(draft.name).toBe('الباقة الأساسية');
    expect(draft.limits.adsPerMonth).toBe(10);
    expect(draft.features).toHaveLength(4);
  });

  it('drops features left blank', () => {
    const form = buildPlanFormGroup(basic);
    form.controls.features.at(0).setValue('   ');

    expect(toPlanDraft(form).features).toHaveLength(3);
  });

  it('keeps an unlimited allowance as null rather than zero', () => {
    const featured = MOCK_PLANS.find((plan) => plan.id === 'featured') as PackagePlan;

    const draft = toPlanDraft(buildPlanFormGroup(featured));

    expect(draft.limits.adsPerMonth).toBeNull();
  });
});
