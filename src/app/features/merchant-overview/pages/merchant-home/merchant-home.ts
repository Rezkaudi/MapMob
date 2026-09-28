import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChartPeriod } from '../../../../shared/models/chart-period';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { MerchantOverviewStore } from '../../state/merchant-overview.store';
import { MERCHANT_QUICK_ACTIONS } from '../../state/quick-actions';
import { LatestReviewsCard } from '../../ui/latest-reviews-card/latest-reviews-card';
import { QuickActionCard } from '../../ui/quick-action-card/quick-action-card';
import { RecentActivityCard } from '../../ui/recent-activity-card/recent-activity-card';
import { StorePerformanceCard } from '../../ui/store-performance-card/store-performance-card';
import { SubscriptionCard } from '../../ui/subscription-card/subscription-card';

const STAT_PLACEHOLDERS = [1, 2, 3, 4];

@Component({
  selector: 'app-merchant-home',
  imports: [
    ErrorState,
    LatestReviewsCard,
    QuickActionCard,
    RecentActivityCard,
    Skeleton,
    StatCard,
    StorePerformanceCard,
    SubscriptionCard,
  ],
  templateUrl: './merchant-home.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantHome {
  protected readonly store = inject(MerchantOverviewStore);
  protected readonly quickActions = MERCHANT_QUICK_ACTIONS;
  protected readonly statPlaceholders = STAT_PLACEHOLDERS;

  constructor() {
    this.store.loadOverview();
  }

  protected onPeriodChange(period: string): void {
    this.store.setPerformancePeriod(period as ChartPeriod);
  }
}
