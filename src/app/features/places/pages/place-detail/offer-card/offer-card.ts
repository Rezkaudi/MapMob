import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { LazyImage } from '../../../../../shared/ui/lazy-image/lazy-image';
import { PlaceOffer } from '../../../models/place-offer';

/** One 200×270 promotion card from the offers grid. */
@Component({
  selector: 'app-offer-card',
  imports: [AppIcon, LazyImage],
  templateUrl: './offer-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferCard {
  readonly offer = input.required<PlaceOffer>();
}
