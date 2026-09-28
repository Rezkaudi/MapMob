import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { MerchantSubscription } from '../../models/merchant-subscription';
import { SubscriptionProgress } from '../../state/subscription-progress';
import { OverviewCardHeading } from '../overview-card-heading/overview-card-heading';

const SUBSCRIPTION_ROUTE = '/merchant/subscription';

@Component({
  selector: 'app-subscription-card',
  imports: [AppIcon, OverviewCardHeading, RouterLink],
  templateUrl: './subscription-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionCard {
  readonly subscription = input.required<MerchantSubscription>();
  readonly progress = input.required<SubscriptionProgress>();

  protected readonly subscriptionRoute = SUBSCRIPTION_ROUTE;
}
