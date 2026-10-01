import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AddButton } from '../../../../shared/ui/add-button/add-button';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { DistributionCard } from '../../../../shared/ui/distribution-card/distribution-card';
import { EmptyPageMessage } from '../../../../shared/ui/empty-page-message/empty-page-message';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { PlanUsageCard } from '../../../../shared/ui/plan-usage-card/plan-usage-card';
import { Toast } from '../../../../shared/ui/toast/toast';
import { MerchantStoriesStore } from '../../state/merchant-stories.store';
import { ActiveStoryCard } from '../../ui/active-story-card/active-story-card';
import { ExpiredStoryCard } from '../../ui/expired-story-card/expired-story-card';
import { MerchantStoriesSkeleton } from '../../ui/merchant-stories-skeleton/merchant-stories-skeleton';
import { StoryDetailDrawer } from '../../../../shared/ui/story-detail-drawer/story-detail-drawer';
import { StoryFormDialog } from '../../ui/story-form-dialog/story-form-dialog';

@Component({
  selector: 'app-merchant-stories-page',
  imports: [
    ActiveStoryCard,
    AddButton,
    ConfirmActionDialog,
    DistributionCard,
    EmptyPageMessage,
    ErrorState,
    ExpiredStoryCard,
    MerchantStoriesSkeleton,
    PageHeader,
    PlanUsageCard,
    StoryDetailDrawer,
    StoryFormDialog,
    Toast,
  ],
  providers: [MerchantStoriesStore],
  templateUrl: './merchant-stories-page.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantStoriesPage {
  protected readonly store = inject(MerchantStoriesStore);

  constructor() {
    this.store.load();
  }
}
