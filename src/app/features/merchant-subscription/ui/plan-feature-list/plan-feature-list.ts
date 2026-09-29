import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** `inverse` is the featured plan's blue card. */
export type PlanFeatureListTone = 'plain' | 'inverse';

const TONES: Record<PlanFeatureListTone, { heading: string; item: string; gap: string }> = {
  plain: { heading: 'text-text-primary', item: 'font-medium text-text-secondary', gap: 'gap-2.5' },
  inverse: { heading: 'text-white', item: 'text-[#EFF6FF]', gap: 'gap-2' },
};

/** "حدود الاستخدام والمزايا:" and its ticked lines, on a plan card and in the details dialog. */
@Component({
  selector: 'app-plan-feature-list',
  imports: [AppIcon],
  templateUrl: './plan-feature-list.html',
  host: { class: 'flex flex-col gap-[14px] pt-[16.7px]' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanFeatureList {
  readonly features = input.required<readonly string[]>();
  readonly tone = input<PlanFeatureListTone>('plain');

  protected readonly skin = computed(() => TONES[this.tone()]);
}
