import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AddButton } from '../../../../shared/ui/add-button/add-button';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { EmptyPageMessage } from '../../../../shared/ui/empty-page-message/empty-page-message';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { PlanUsageCard } from '../../../../shared/ui/plan-usage-card/plan-usage-card';
import { Toast } from '../../../../shared/ui/toast/toast';
import { MerchantMediaStore } from '../../state/merchant-media.store';
import { MediaAddDialog } from '../../ui/media-add-dialog/media-add-dialog';
import { MediaAddTile } from '../../ui/media-add-tile/media-add-tile';
import { MediaCard } from '../../ui/media-card/media-card';
import { MediaDistributionCard } from '../../ui/media-distribution-card/media-distribution-card';
import { MediaTabs } from '../../ui/media-tabs/media-tabs';
import { MerchantMediaSkeleton } from '../../ui/merchant-media-skeleton/merchant-media-skeleton';

@Component({
  selector: 'app-merchant-media-page',
  imports: [
    AddButton,
    ConfirmActionDialog,
    EmptyPageMessage,
    ErrorState,
    MediaAddDialog,
    MediaAddTile,
    MediaCard,
    MediaDistributionCard,
    MediaTabs,
    MerchantMediaSkeleton,
    PageHeader,
    PlanUsageCard,
    Toast,
  ],
  providers: [MerchantMediaStore],
  templateUrl: './merchant-media-page.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantMediaPage {
  protected readonly store = inject(MerchantMediaStore);

  constructor() {
    this.store.load();
  }
}
