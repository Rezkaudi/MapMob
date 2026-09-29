import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { DeliveryLink } from '../../../../../shared/models/delivery-link';
import { InfoCard } from '../../../../../shared/ui/info-card/info-card';
import { listOpenableDeliveryLinks } from '../../../state/openable-delivery-links';
import { DeliveryLinkPreview } from '../delivery-link-preview/delivery-link-preview';

@Component({
  selector: 'app-place-delivery-card',
  imports: [DeliveryLinkPreview, InfoCard],
  templateUrl: './place-delivery-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceDeliveryCard {
  readonly links = input.required<readonly DeliveryLink[]>();
  readonly edit = output<void>();

  protected readonly openableLinks = computed(() => listOpenableDeliveryLinks(this.links()));
}
