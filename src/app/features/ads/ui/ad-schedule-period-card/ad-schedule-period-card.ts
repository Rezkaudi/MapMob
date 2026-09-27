import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AdDetailView } from '../../state/ad-detail-view';

/** "فترة الظهور والجدولة": the first and the last day the ad runs. */
@Component({
  selector: 'app-ad-schedule-period-card',
  templateUrl: './ad-schedule-period-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdSchedulePeriodCard {
  readonly view = input.required<AdDetailView>();
}
