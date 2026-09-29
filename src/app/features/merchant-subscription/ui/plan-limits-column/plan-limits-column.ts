import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PlanLimitColumn } from '../../models/plan-downgrade-view';

export type PlanLimitsColumnTone = 'current' | 'target';

const TONES: Record<PlanLimitsColumnTone, { card: string; divider: string; chip: string }> = {
  current: {
    card: 'border-2 border-primary/30 bg-[rgba(239,246,255,0.5)]',
    divider: 'border-primary/15',
    chip: 'bg-primary text-white',
  },
  target: {
    card: 'border border-border bg-surface-muted',
    divider: 'border-border',
    chip: 'bg-border text-[#334155]',
  },
};

/** One side of the downgrade comparison: the plan's four limits. */
@Component({
  selector: 'app-plan-limits-column',
  templateUrl: './plan-limits-column.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanLimitsColumn {
  readonly heading = input.required<string>();
  readonly column = input.required<PlanLimitColumn>();
  readonly tone = input.required<PlanLimitsColumnTone>();

  protected readonly skin = computed(() => TONES[this.tone()]);
}
