import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { SectionPanel } from '../../../../../shared/ui/section-panel/section-panel';
import { PlaceOffer } from '../../../models/place-offer';
import { OfferCard } from '../offer-card/offer-card';

@Component({
  selector: 'app-place-offers-card',
  imports: [SectionPanel, OfferCard],
  templateUrl: './place-offers-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceOffersCard {
  readonly offers = input.required<readonly PlaceOffer[]>();
  readonly placeName = input.required<string>();

  protected readonly countLabel = computed(() => `${this.offers().length} عروض`);
  protected readonly subtitle = computed(
    () => `العروض الترويجية الحالية الخاصة ب${this.placeName()}`,
  );
}
