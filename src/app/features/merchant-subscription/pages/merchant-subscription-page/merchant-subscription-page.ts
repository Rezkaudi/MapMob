import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { BillingCycleToggle } from '../../../../shared/ui/billing-cycle-toggle/billing-cycle-toggle';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { Toast } from '../../../../shared/ui/toast/toast';
import { MerchantSubscriptionStore } from '../../state/merchant-subscription.store';
import { MerchantSubscriptionSkeleton } from '../../ui/merchant-subscription-skeleton/merchant-subscription-skeleton';
import { PlanDowngradeDialog } from '../../ui/plan-downgrade-dialog/plan-downgrade-dialog';
import { PlanOfferCard } from '../../ui/plan-offer-card/plan-offer-card';
import { PlanRequestDialog } from '../../ui/plan-request-dialog/plan-request-dialog';
import { SectionHeading } from '../../ui/section-heading/section-heading';
import { SubscriptionDetailsDialog } from '../../ui/subscription-details-dialog/subscription-details-dialog';
import { SubscriptionHeroCard } from '../../ui/subscription-hero-card/subscription-hero-card';
import { SubscriptionHistoryTable } from '../../ui/subscription-history-table/subscription-history-table';
import { UsageCard } from '../../ui/usage-card/usage-card';

@Component({
  selector: 'app-merchant-subscription-page',
  imports: [
    BillingCycleToggle,
    ErrorState,
    MerchantSubscriptionSkeleton,
    PageHeader,
    PlanDowngradeDialog,
    PlanOfferCard,
    PlanRequestDialog,
    SectionHeading,
    SubscriptionDetailsDialog,
    SubscriptionHeroCard,
    SubscriptionHistoryTable,
    Toast,
    UsageCard,
  ],
  providers: [MerchantSubscriptionStore],
  templateUrl: './merchant-subscription-page.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantSubscriptionPage {
  protected readonly store = inject(MerchantSubscriptionStore);

  constructor() {
    this.store.load();
  }
}
