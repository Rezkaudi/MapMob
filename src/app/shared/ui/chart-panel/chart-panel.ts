import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';
import { Skeleton } from '../skeleton/skeleton';
import { ChartPeriodOption } from './chart-period-option';

const DEFAULT_CHART_HEIGHT = '280px';

/** A chart card: title on the start side, period tabs and a calendar button on the end side. */
@Component({
  selector: 'app-chart-panel',
  imports: [AppIcon, Skeleton],
  templateUrl: './chart-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPanel {
  readonly title = input.required<string>();
  readonly periods = input.required<readonly ChartPeriodOption[]>();
  readonly activePeriod = input.required<string>();
  readonly isLoading = input<boolean>(false);
  /** Height of the placeholder drawn while the chart loads. */
  readonly chartHeight = input<string>(DEFAULT_CHART_HEIGHT);
  readonly periodChange = output<string>();
}
