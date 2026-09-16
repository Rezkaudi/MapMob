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
import { AdsStore } from '../../state/ads.store';
import { buildAdDeleteCopy } from '../../ui/ad-dialog-copy';
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
  /** View state only: the ad waiting for the delete to be confirmed. */
  protected readonly pendingDeletion = signal<Ad | null>(null);
  protected readonly deleteCopy = computed(() => {
    const ad = this.pendingDeletion();
    return ad ? buildAdDeleteCopy(ad) : null;
  });

  constructor() {
    this.store.loadAds();
    this.store.loadSummary();
  }

  protected addAd(): void {
    this.router.navigateByUrl(NEW_AD_URL);
  }

  protected editAd(ad: Ad): void {
    this.router.navigateByUrl(`/ads/${ad.id}/edit`);
  }

  protected async confirmDeletion(): Promise<void> {
    const ad = this.pendingDeletion();
    if (ad && (await this.store.deleteAd(ad.id))) {
      this.pendingDeletion.set(null);
    }
  }

  protected cancelDeletion(): void {
    this.pendingDeletion.set(null);
    this.store.clearSaveError();
  }

  protected async exportAds(): Promise<void> {
    const file = await this.store.exportAds();
    if (file) {
      this.fileSaver.save(file, `ads-${toCalendarDay(this.clock())}.csv`);
    }
  }
}
