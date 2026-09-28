import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { MERCHANT_NOTIFICATIONS_ROUTE } from '../../../../layout/merchant-shell/merchant-nav-items';
import { MerchantActivityRow } from '../../models/merchant-activity-row';
import { OverviewCardHeading } from '../overview-card-heading/overview-card-heading';

const PLACEHOLDER_ROWS = [1, 2, 3, 4];

@Component({
  selector: 'app-recent-activity-card',
  imports: [AppIcon, OverviewCardHeading, Skeleton],
  templateUrl: './recent-activity-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RecentActivityCard {
  readonly rows = input.required<readonly MerchantActivityRow[]>();
  readonly isLoading = input<boolean>(false);

  protected readonly notificationsRoute = MERCHANT_NOTIFICATIONS_ROUTE;
  protected readonly placeholderRows = PLACEHOLDER_ROWS;
}
