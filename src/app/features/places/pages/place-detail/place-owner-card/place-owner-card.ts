import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { InfoCard } from '../../../../../shared/ui/info-card/info-card';
import { PlaceOwner } from '../../../models/place-owner';
import { PlaceFactRow } from '../place-fact-row/place-fact-row';

@Component({
  selector: 'app-place-owner-card',
  imports: [AppIcon, InfoCard, PlaceFactRow],
  templateUrl: './place-owner-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceOwnerCard {
  readonly owner = input.required<PlaceOwner>();
  readonly edit = output<void>();

  protected readonly callHref = computed(() => `tel:${this.owner().phone}`);
}
