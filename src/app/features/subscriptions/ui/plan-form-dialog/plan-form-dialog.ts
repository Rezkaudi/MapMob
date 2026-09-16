import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  input,
  output,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { PackagePlan } from '../../models/package-plan';
import { PlanDraft } from '../../models/plan-draft';
import { buildPlanFormGroup, toPlanDraft } from '../../state/plan-form-group';
import { LimitStepper } from '../limit-stepper/limit-stepper';
import { PlanFeatureRows } from '../plan-feature-rows/plan-feature-rows';
import { PriceCycleCard } from '../price-cycle-card/price-cycle-card';
import { PLAN_LIMIT_FIELDS, PlanLimitField } from './plan-limit-fields';

const YEARLY_MONTHS = 12;
const PERCENT = 100;

@Component({
  selector: 'app-plan-form-dialog',
  imports: [AppIcon, LimitStepper, PlanFeatureRows, PriceCycleCard, ReactiveFormsModule],
  templateUrl: './plan-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanFormDialog {
  readonly plan = input.required<PackagePlan>();
  readonly isBusy = input<boolean>(false);
  readonly saved = output<PlanDraft>();
  readonly cancelled = output<void>();

  /** A fresh form per package, so reopening the dialog forgets the last edit. */
  protected readonly form = computed(() => buildPlanFormGroup(this.plan()));
  protected readonly limitFields = PLAN_LIMIT_FIELDS;
  protected readonly subtitle = computed(
    () => `تعديل تفاصيل وأسعار «${this.plan().name}» في المنصة`,
  );

  protected limitControl(field: PlanLimitField): FormControl<number> {
    return this.form().controls.limits.controls[field.key];
  }

  /** How much cheaper a year is than paying month by month, as the green badge reports it. */
  protected readonly yearlyDiscount = computed(() => {
    const { monthlyPrice, yearlyPrice } = this.form().getRawValue();
    const fullYear = (monthlyPrice ?? 0) * YEARLY_MONTHS;
    if (!yearlyPrice || fullYear <= 0 || yearlyPrice >= fullYear) {
      return null;
    }
    return Math.round(((fullYear - yearlyPrice) / fullYear) * PERCENT);
  });

  protected save(): void {
    this.form().markAllAsTouched();
    if (this.form().valid) {
      this.saved.emit(toPlanDraft(this.form()));
    }
  }

  @HostListener('document:keydown.escape')
  protected cancelOnEscape(): void {
    this.cancelled.emit();
  }
}
