import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Toast } from '../../../../shared/ui/toast/toast';
import { AdConfirmAction } from '../../models/ad-confirm-action';
import { AdDetailStore } from '../../state/ad-detail.store';
import { AdsStore } from '../../state/ads.store';
import { buildAdConfirmCopy } from '../../ui/ad-dialog-copy';
import { AdDetailCard } from '../../ui/ad-detail-card/ad-detail-card';
import { AdInfoCard } from '../../ui/ad-info-card/ad-info-card';
import { AdMetricsCard } from '../../ui/ad-metrics-card/ad-metrics-card';
import { AdOverviewCard } from '../../ui/ad-overview-card/ad-overview-card';
import { AdSchedulePeriodCard } from '../../ui/ad-schedule-period-card/ad-schedule-period-card';

const ADS_URL = '/ads';

@Component({
  selector: 'app-ad-detail',
  imports: [
    AdDetailCard,
    AdInfoCard,
    AdMetricsCard,
    AdOverviewCard,
    AdSchedulePeriodCard,
    ConfirmActionDialog,
    ErrorState,
    FormPageHeading,
    Skeleton,
    Toast,
  ],
  templateUrl: './ad-detail.html',
  providers: [AdDetailStore],
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdDetailPage {
  /** Bound from the `:id` route parameter. */
  readonly id = input.required<string>();

  private readonly router = inject(Router);

  protected readonly store = inject(AdDetailStore);
  protected readonly adsStore = inject(AdsStore);
  /** View state only: the change waiting to be confirmed. */
  protected readonly pendingAction = signal<AdConfirmAction | null>(null);
  protected readonly confirmCopy = computed(() => {
    const action = this.pendingAction();
    const ad = this.store.detail()?.ad;
    return action && ad ? buildAdConfirmCopy(action, ad) : null;
  });

  constructor() {
    this.store.loadAd(this.id);
  }

  protected reload(): void {
    this.store.loadAd(this.id());
  }

  protected askToChangeStatus(): void {
    const action = this.store.view()?.pauseAction;
    if (action) {
      this.pendingAction.set(action);
    }
  }

  protected askToDelete(): void {
    this.pendingAction.set('delete');
  }

  protected editAd(): void {
    this.router.navigateByUrl(`${ADS_URL}/${this.id()}/edit`);
  }

  protected cancelPending(): void {
    this.pendingAction.set(null);
    this.adsStore.clearSaveError();
  }

  protected async confirmPending(): Promise<void> {
    const action = this.pendingAction();
    if (!action || !(await this.save(action))) {
      return;
    }
    this.pendingAction.set(null);
    if (action === 'delete') {
      await this.router.navigateByUrl(ADS_URL);
      return;
    }
    this.reload();
  }

  private save(action: AdConfirmAction): Promise<boolean> {
    const id = this.id();
    if (action === 'pause') {
      return this.adsStore.pauseAd(id);
    }
    if (action === 'resume') {
      return this.adsStore.resumeAd(id);
    }
    return this.adsStore.deleteAd(id);
  }
}
