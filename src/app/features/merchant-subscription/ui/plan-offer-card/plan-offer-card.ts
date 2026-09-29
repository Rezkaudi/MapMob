import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PlanCardView } from '../../models/plan-card-view';
import { PlanFeatureList } from '../plan-feature-list/plan-feature-list';
import { PLAN_OFFER_SKINS, pickPlanActionClasses, pickPlanCardBorder } from './plan-offer-skin';

/** The buttons that say what the card is stay at full strength when disabled. */
const STATE_ACTIONS = new Set(['current', 'pending']);

/** One plan under "الباقات المتاحة". */
@Component({
  selector: 'app-plan-offer-card',
  imports: [PlanFeatureList],
  templateUrl: './plan-offer-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlanOfferCard {
  readonly card = input.required<PlanCardView>();
  readonly act = output<PlanCardView>();

  protected readonly skin = computed(() => PLAN_OFFER_SKINS[this.card().plan.tier]);
  protected readonly cardClasses = computed(
    () => `${this.skin().card} ${pickPlanCardBorder(this.card().isCurrent)}`,
  );
  /** Waiting on another request: the button is greyed out as well as disabled. */
  protected readonly isLocked = computed(() => {
    const { action } = this.card();
    return action.isDisabled && !STATE_ACTIONS.has(action.kind);
  });
  protected readonly actionClasses = computed(() =>
    pickPlanActionClasses(this.card().action.kind, this.skin().isInverse),
  );
}
