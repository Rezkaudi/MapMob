import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';
import { ChartPeriodOption } from './chart-period-option';

/** A chart card: title on the start side, period tabs and a calendar button on the end side. */
@Component({
  selector: 'app-chart-panel',
  imports: [AppIcon],
  templateUrl: './chart-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChartPanel {
  readonly title = input.required<string>();
  readonly periods = input.required<readonly ChartPeriodOption[]>();
  readonly activePeriod = input.required<string>();
  readonly periodChange = output<string>();
}
