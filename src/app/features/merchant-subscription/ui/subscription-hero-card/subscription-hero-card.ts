import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { SubscriptionHeroView } from '../../models/subscription-hero-view';
import { SubscriptionStatusBadge } from '../subscription-status-badge/subscription-status-badge';

/** The "باقتك الحالية" card at the top of the page. */
@Component({
  selector: 'app-subscription-hero-card',
  imports: [SubscriptionStatusBadge],
  templateUrl: './subscription-hero-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionHeroCard {
  readonly hero = input.required<SubscriptionHeroView>();
  readonly upgrade = output<void>();
  readonly details = output<void>();
}
