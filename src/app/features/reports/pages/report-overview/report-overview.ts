import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { toCalendarDay } from '../../../../shared/formatting/calendar-day';
import { ChartPeriod } from '../../../../shared/models/chart-period';
import { ChartPanel } from '../../../../shared/ui/chart-panel/chart-panel';
import {
  DAY_TO_MONTH_PERIODS,
  WEEK_TO_YEAR_PERIODS,
} from '../../../../shared/ui/chart-panel/chart-period-choices';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { Toast } from '../../../../shared/ui/toast/toast';
import { REPORT_CARD_TITLES } from '../../models/report-card-titles';
import { ReportsStore } from '../../state/reports.store';
import { CategoryShareChart } from '../../ui/category-share-chart/category-share-chart';
import { GovernorateActivityList } from '../../ui/governorate-activity-list/governorate-activity-list';
import { UsageMetricList } from '../../ui/usage-metric-list/usage-metric-list';

@Component({
  selector: 'app-report-overview',
  imports: [
    ChartComponent,
    ChartPanel,
    ErrorState,
    PageHeader,
    Toast,
    CategoryShareChart,
    GovernorateActivityList,
    UsageMetricList,
  ],
  templateUrl: './report-overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportOverview {
  protected readonly store = inject(ReportsStore);
  private readonly fileSaver = inject(FileSaver);
  private readonly clock = inject(CLOCK);

  protected readonly titles = REPORT_CARD_TITLES;
  protected readonly dayToMonthPeriods = DAY_TO_MONTH_PERIODS;
  protected readonly weekToYearPeriods = WEEK_TO_YEAR_PERIODS;

  constructor() {
    this.store.loadReports();
  }

  protected changeGrowthPeriod(period: string): void {
    this.store.setGrowthPeriod(period as ChartPeriod);
  }

  protected changeUsagePeriod(period: string): void {
    this.store.setUsagePeriod(period as ChartPeriod);
  }

  protected changeRevenuePeriod(period: string): void {
    this.store.setRevenuePeriod(period as ChartPeriod);
  }

  protected async exportReports(): Promise<void> {
    const file = await this.store.exportReports();
    if (file) {
      this.fileSaver.save(file, `statistics-${toCalendarDay(this.clock())}.csv`);
    }
  }
}
