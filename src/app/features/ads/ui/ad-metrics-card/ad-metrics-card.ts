import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { AdMetricCard } from '../../state/ad-metric-cards';
import { AD_METRIC_SKINS } from './ad-metric-skin';

/** "إحصائيات الأداء والتفاعل": the 2×2 grid of counts under the ad. */
@Component({
  selector: 'app-ad-metrics-card',
  imports: [AppIcon],
  templateUrl: './ad-metrics-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdMetricsCard {
  readonly cards = input.required<readonly AdMetricCard[]>();

  protected readonly skins = AD_METRIC_SKINS;
}
