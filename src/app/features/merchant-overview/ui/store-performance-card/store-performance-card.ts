import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ChartPanel } from '../../../../shared/ui/chart-panel/chart-panel';
import { WEEK_TO_YEAR_PERIODS } from '../../../../shared/ui/chart-panel/chart-period-choices';
import { AreaChartOptions } from '../../../reports/models/area-chart-options';

// ApexCharts draws 248px plus its month labels; the placeholder keeps that room.
const CHART_PLACEHOLDER_HEIGHT = '257px';

@Component({
  selector: 'app-store-performance-card',
  imports: [AppIcon, ChartComponent, ChartPanel],
  templateUrl: './store-performance-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StorePerformanceCard {
  readonly chartOptions = input.required<AreaChartOptions>();
  readonly activePeriod = input.required<string>();
  readonly isLoading = input<boolean>(false);
  readonly dailyAverageText = input.required<string>();
  readonly peakDayText = input.required<string>();
  readonly periodChange = output<string>();

  protected readonly periods = WEEK_TO_YEAR_PERIODS;
  protected readonly placeholderHeight = CHART_PLACEHOLDER_HEIGHT;
}
