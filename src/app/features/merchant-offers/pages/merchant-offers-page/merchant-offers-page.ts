import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AddButton } from '../../../../shared/ui/add-button/add-button';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { CountTiles } from '../../../../shared/ui/count-tiles/count-tiles';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { PlanUsageCard } from '../../../../shared/ui/plan-usage-card/plan-usage-card';
import { Toast } from '../../../../shared/ui/toast/toast';
import { NEW_MERCHANT_OFFER_URL, editMerchantOfferUrl } from '../../merchant-offer-links';
import { MerchantOffer } from '../../models/merchant-offer';
import { MerchantOffersStore } from '../../state/merchant-offers.store';
import { MerchantOfferDrawer } from '../../ui/merchant-offer-drawer/merchant-offer-drawer';
import { MerchantOfferTable } from '../../ui/merchant-offer-table/merchant-offer-table';
import { MerchantOfferToolbar } from '../../ui/merchant-offer-toolbar/merchant-offer-toolbar';

@Component({
  selector: 'app-merchant-offers-page',
  imports: [
    AddButton,
    ConfirmActionDialog,
    CountTiles,
    ErrorState,
    MerchantOfferDrawer,
    MerchantOfferTable,
    MerchantOfferToolbar,
    PageHeader,
    PlanUsageCard,
    Toast,
  ],
  providers: [MerchantOffersStore],
  templateUrl: './merchant-offers-page.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantOffersPage {
  private readonly router = inject(Router);
  protected readonly store = inject(MerchantOffersStore);

  constructor() {
    this.store.load();
  }

  protected addOffer(): void {
    this.router.navigateByUrl(NEW_MERCHANT_OFFER_URL);
  }

  protected editOffer(offer: MerchantOffer): void {
    this.router.navigateByUrl(editMerchantOfferUrl(offer.id));
  }
}
