import { ChangeDetectionStrategy, Component, OutputEmitterRef, input, output } from '@angular/core';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { SideDrawer } from '../../../../shared/ui/side-drawer/side-drawer';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Offer } from '../../models/offer';
import { OfferDetail } from '../../models/offer-detail';
import { OfferDetailView } from '../../state/offer-detail-view';
import { OfferDetailActions } from '../offer-detail-actions/offer-detail-actions';
import { OfferPublisher } from '../offer-publisher/offer-publisher';
import { OfferSummaryCard } from '../offer-summary-card/offer-summary-card';
import { OfferValidityCard } from '../offer-validity-card/offer-validity-card';

@Component({
  selector: 'app-offer-detail-drawer',
  imports: [
    ErrorState,
    OfferDetailActions,
    OfferPublisher,
    OfferSummaryCard,
    OfferValidityCard,
    SideDrawer,
    Skeleton,
  ],
  templateUrl: './offer-detail-drawer.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferDetailDrawer {
  readonly detail = input.required<OfferDetail | null>();
  readonly view = input.required<OfferDetailView | null>();
  readonly isLoading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly isBusy = input<boolean>(false);

  readonly closed = output<void>();
  readonly retry = output<void>();
  readonly edit = output<Offer>();
  readonly pause = output<Offer>();
  readonly resume = output<Offer>();
  readonly remove = output<Offer>();

  protected emitForOpenOffer(emitter: OutputEmitterRef<Offer>): void {
    const offer = this.detail()?.offer;
    if (offer) {
      emitter.emit(offer);
    }
  }
}
