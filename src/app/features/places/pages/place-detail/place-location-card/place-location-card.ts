import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { InfoCard } from '../../../../../shared/ui/info-card/info-card';
import { PlaceLocation } from '../../../models/place-location';

@Component({
  selector: 'app-place-location-card',
  imports: [AppIcon, InfoCard],
  templateUrl: './place-location-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceLocationCard {
  readonly location = input.required<PlaceLocation>();
}
