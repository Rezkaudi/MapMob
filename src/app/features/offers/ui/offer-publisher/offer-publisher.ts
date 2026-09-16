import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { OfferPlace } from '../../models/offer-place';

@Component({
  selector: 'app-offer-publisher',
  imports: [AppIcon, RouterLink],
  templateUrl: './offer-publisher.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferPublisher {
  readonly place = input.required<OfferPlace>();
  readonly initial = input.required<string>();

  protected readonly placeLink = computed(() => ['/places', this.place().id]);
}
