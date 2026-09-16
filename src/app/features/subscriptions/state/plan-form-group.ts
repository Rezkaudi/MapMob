import { FormArray, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { PackagePlan } from '../models/package-plan';
import { PlanDraft } from '../models/plan-draft';
import { PlanLimits } from '../models/plan-limits';

const HAS_TEXT = /\S/;
/** The steppers write an unlimited allowance as this, since a number input cannot hold `null`. */
export const UNLIMITED_LIMIT = -1;

function textControl(value: string, validators: ValidatorFn[] = []) {
  return new FormControl(value, { nonNullable: true, validators });
}

function limitControl(limit: number | null) {
  return new FormControl(limit ?? UNLIMITED_LIMIT, {
    nonNullable: true,
    validators: [Validators.min(UNLIMITED_LIMIT)],
  });
}

function buildLimitsGroup(limits: PlanLimits) {
  return new FormGroup({
    adsPerMonth: limitControl(limits.adsPerMonth),
    activeOffers: limitControl(limits.activeOffers),
    galleryImages: limitControl(limits.galleryImages),
    videos: limitControl(limits.videos),
  });
}

export function buildPlanFormGroup(plan: PackagePlan) {
  return new FormGroup({
    name: textControl(plan.name, [Validators.required, Validators.pattern(HAS_TEXT)]),
    isActive: new FormControl(plan.isActive, { nonNullable: true }),
    monthlyPrice: new FormControl<number | null>(plan.monthlyPrice, [
      Validators.required,
      Validators.min(0),
    ]),
    yearlyPrice: new FormControl<number | null>(plan.yearlyPrice, [Validators.min(0)]),
    currency: textControl(plan.currency),
    limits: buildLimitsGroup(plan.limits),
    features: new FormArray(plan.features.map((feature) => textControl(feature))),
  });
}

export type PlanFormGroup = ReturnType<typeof buildPlanFormGroup>;

function readLimit(value: number): number | null {
  return value === UNLIMITED_LIMIT ? null : value;
}

export function toPlanDraft(form: PlanFormGroup): PlanDraft {
  const value = form.getRawValue();
  return {
    name: value.name.trim(),
    isActive: value.isActive,
    monthlyPrice: value.monthlyPrice ?? 0,
    yearlyPrice: value.yearlyPrice,
    currency: value.currency,
    limits: {
      adsPerMonth: readLimit(value.limits.adsPerMonth),
      activeOffers: readLimit(value.limits.activeOffers),
      galleryImages: readLimit(value.limits.galleryImages),
      videos: readLimit(value.limits.videos),
    },
    features: value.features.map((feature) => feature.trim()).filter(Boolean),
  };
}
