import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { toCalendarDay } from '../../../../shared/formatting/calendar-day';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { EmptyPageMessage } from '../../../../shared/ui/empty-page-message/empty-page-message';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { Offer } from '../../models/offer';
import { OfferDetailStore } from '../../state/offer-detail.store';
import { OffersStore } from '../../state/offers.store';
import { OfferDetailDrawer } from '../../ui/offer-detail-drawer/offer-detail-drawer';
import { buildOfferDeleteCopy } from '../../ui/offer-dialog-copy';
import { OfferTable } from '../../ui/offer-table/offer-table';
import { OfferToolbar } from '../../ui/offer-toolbar/offer-toolbar';

const NEW_OFFER_URL = '/offers/new';

@Component({
  selector: 'app-offer-list',
  imports: [
    ConfirmActionDialog,
    ErrorState,
    EmptyPageMessage,
    OfferDetailDrawer,
    OfferTable,
    OfferToolbar,
    PageHeader,
    StatCard,
    TablePagination,
    Toast,
  ],
  templateUrl: './offer-list.html',
  providers: [OfferDetailStore],
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferList {
  private readonly router = inject(Router);
  private readonly fileSaver = inject(FileSaver);
  private readonly clock = inject(CLOCK);

  protected readonly store = inject(OffersStore);
  protected readonly detailStore = inject(OfferDetailStore);
  /** View state only: the offer waiting for the delete to be confirmed. */
  protected readonly pendingDeletion = signal<Offer | null>(null);
  protected readonly deleteCopy = computed(() => {
    const offer = this.pendingDeletion();
    return offer ? buildOfferDeleteCopy(offer) : null;
  });

  constructor() {
    this.store.loadOffers();
    this.store.loadSummary();
  }

  protected addOffer(): void {
    this.router.navigateByUrl(NEW_OFFER_URL);
  }

  protected editOffer(offer: Offer): void {
    this.router.navigateByUrl(`/offers/${offer.id}/edit`);
  }

  protected pauseOffer(offer: Offer): void {
    this.closeDrawerWhenSaved(this.store.pauseOffer(offer.id));
  }

  protected resumeOffer(offer: Offer): void {
    this.closeDrawerWhenSaved(this.store.resumeOffer(offer.id));
  }

  protected async confirmDeletion(): Promise<void> {
    const offer = this.pendingDeletion();
    if (offer && (await this.store.deleteOffer(offer.id))) {
      this.pendingDeletion.set(null);
      this.detailStore.close();
    }
  }

  protected cancelDeletion(): void {
    this.pendingDeletion.set(null);
    this.store.clearSaveError();
  }

  protected async exportOffers(): Promise<void> {
    const file = await this.store.exportOffers();
    if (file) {
      this.fileSaver.save(file, `offers-${toCalendarDay(this.clock())}.csv`);
    }
  }

  private async closeDrawerWhenSaved(save: Promise<boolean>): Promise<void> {
    if (await save) {
      this.detailStore.close();
    }
  }
}
