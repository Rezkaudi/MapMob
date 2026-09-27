import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { toCalendarDay } from '../../../../shared/formatting/calendar-day';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { EmptyPageMessage } from '../../../../shared/ui/empty-page-message/empty-page-message';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { Ad } from '../../models/ad';
import { AdConfirmRequest } from '../../models/ad-confirm-request';
import { adPauseActionFor } from '../../state/ad-pause-action';
import { AdsStore } from '../../state/ads.store';
import { buildAdConfirmCopy } from '../../ui/ad-dialog-copy';
import { AdTable } from '../../ui/ad-table/ad-table';
import { AdToolbar } from '../../ui/ad-toolbar/ad-toolbar';

const NEW_AD_URL = '/ads/new';

@Component({
  selector: 'app-ad-list',
  imports: [
    AdTable,
    AdToolbar,
    ConfirmActionDialog,
    EmptyPageMessage,
    ErrorState,
    PageHeader,
    StatCard,
    TablePagination,
    Toast,
  ],
  templateUrl: './ad-list.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdList {
  private readonly router = inject(Router);
  private readonly fileSaver = inject(FileSaver);
  private readonly clock = inject(CLOCK);

  protected readonly store = inject(AdsStore);
  /** View state only: the change waiting to be confirmed. */
  protected readonly pendingConfirm = signal<AdConfirmRequest | null>(null);
  protected readonly confirmCopy = computed(() => {
    const request = this.pendingConfirm();
    return request ? buildAdConfirmCopy(request.action, request.ad) : null;
  });

  constructor() {
    this.store.loadAds();
    this.store.loadSummary();
  }

  protected addAd(): void {
    this.router.navigateByUrl(NEW_AD_URL);
  }

  protected viewAd(ad: Ad): void {
    this.router.navigateByUrl(`/ads/${ad.id}`);
  }

  protected editAd(ad: Ad): void {
    this.router.navigateByUrl(`/ads/${ad.id}/edit`);
  }

  protected askToChangeStatus(ad: Ad): void {
    const action = adPauseActionFor(ad.status);
    if (action) {
      this.pendingConfirm.set({ action, ad });
    }
  }

  protected askToDelete(ad: Ad): void {
    this.pendingConfirm.set({ action: 'delete', ad });
  }

  protected async confirmPending(): Promise<void> {
    const request = this.pendingConfirm();
    if (request && (await this.save(request))) {
      this.pendingConfirm.set(null);
    }
  }

  protected cancelPending(): void {
    this.pendingConfirm.set(null);
    this.store.clearSaveError();
  }

  private save(request: AdConfirmRequest): Promise<boolean> {
    if (request.action === 'pause') {
      return this.store.pauseAd(request.ad.id);
    }
    if (request.action === 'resume') {
      return this.store.resumeAd(request.ad.id);
    }
    return this.store.deleteAd(request.ad.id);
  }

  protected async exportAds(): Promise<void> {
    const file = await this.store.exportAds();
    if (file) {
      this.fileSaver.save(file, `ads-${toCalendarDay(this.clock())}.csv`);
    }
  }
}
