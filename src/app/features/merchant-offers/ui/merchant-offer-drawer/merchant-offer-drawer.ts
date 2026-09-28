import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { OfferSummaryCard } from '../../../../shared/ui/offer-summary-card/offer-summary-card';
import { OfferValidityCard } from '../../../../shared/ui/offer-validity-card/offer-validity-card';
import { SideDrawer } from '../../../../shared/ui/side-drawer/side-drawer';
import { MerchantOfferDetail } from '../../models/merchant-offer-detail';
import { MerchantOfferActions } from '../merchant-offer-actions/merchant-offer-actions';

@Component({
  selector: 'app-merchant-offer-drawer',
  imports: [MerchantOfferActions, OfferSummaryCard, OfferValidityCard, SideDrawer],
  templateUrl: './merchant-offer-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantOfferDrawer {
  readonly detail = input.required<MerchantOfferDetail>();
  readonly isBusy = input<boolean>(false);

  readonly closed = output<void>();
  readonly edit = output<void>();
  readonly pause = output<void>();
  readonly resume = output<void>();
  readonly remove = output<void>();
}
