import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { PlanTier } from '../../models/plan-tier';

const TIER_BACKGROUND: Record<PlanTier, string> = {
  featured: 'bg-accent',
  basic: 'bg-primary',
  free: 'bg-[#94a3b8]',
};

/** The package a company is on, as the table's crowned pill. */
@Component({
  selector: 'app-plan-pill',
  imports: [AppIcon],
  template: `<span
    class="inline-flex items-center gap-1.5 rounded-2xl px-3 py-1 text-[12px]/[18px] whitespace-nowrap text-white"
    [class]="background()"
  >
    <app-icon name="crown-outline" [size]="12" aria-hidden="true" />
    <span>{{ name() }}</span>
  </span>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanPill {
  readonly name = input.required<string>();
  readonly tier = input.required<PlanTier>();

  protected readonly background = computed(() => TIER_BACKGROUND[this.tier()]);
}
