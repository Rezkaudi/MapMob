import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatShortEnglishDate } from '../../../../../shared/formatting/short-english-date';
import { InfoCard } from '../../../../../shared/ui/info-card/info-card';
import { PlaceActivity } from '../../../models/place-activity';
import { PlaceFactRow } from '../place-fact-row/place-fact-row';

@Component({
  selector: 'app-place-activity-card',
  imports: [InfoCard, PlaceFactRow],
  templateUrl: './place-activity-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceActivityCard {
  readonly activity = input.required<PlaceActivity>();

  protected readonly addedOn = computed(() => formatShortEnglishDate(this.activity().addedAt));
}
