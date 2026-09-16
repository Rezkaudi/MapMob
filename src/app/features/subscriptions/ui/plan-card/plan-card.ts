import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { PackagePlan } from '../../models/package-plan';
import { buildPlanCardView } from '../../state/plan-card-view';
import { PLAN_TIER_SKINS } from './plan-tier-skin';

@Component({
  selector: 'app-plan-card',
  imports: [AppIcon, RowActionsMenu],
  templateUrl: './plan-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanCard {
  readonly plan = input.required<PackagePlan>();
  readonly edit = output<PackagePlan>();
  readonly statusChange = output<PackagePlan>();
  readonly remove = output<PackagePlan>();

  protected readonly view = computed(() => buildPlanCardView(this.plan()));
  protected readonly skin = computed(() => PLAN_TIER_SKINS[this.plan().tier]);
}
