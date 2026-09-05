import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { InfoCard } from '../../../../../shared/ui/info-card/info-card';
import { WorkingHoursRow } from '../../../models/working-hours-row';

@Component({
  selector: 'app-place-hours-card',
  imports: [InfoCard],
  templateUrl: './place-hours-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceHoursCard {
  readonly rows = input.required<readonly WorkingHoursRow[]>();
  readonly isOpenNow = input<boolean>(false);
}
