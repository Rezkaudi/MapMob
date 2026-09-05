import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ChartComponent } from 'ng-apexcharts';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { ChartPanel } from '../../../../shared/ui/chart-panel/chart-panel';
import { ChartPeriodOption } from '../../../../shared/ui/chart-panel/chart-period-option';
import { DashboardStore } from '../../state/dashboard.store';
import { ChartPeriod } from '../../data/dashboard.repository';
import { ActionCenter } from './action-center/action-center';
import { RecentPlacesTable } from './recent-places-table/recent-places-table';

const REVENUE_PERIODS: readonly ChartPeriodOption[] = [
  { value: 'daily', label: 'يومي' },
  { value: 'weekly', label: 'اسبوعي' },
  { value: 'monthly', label: 'شهري' },
];

const GROWTH_PERIODS: readonly ChartPeriodOption[] = [
  { value: 'weekly', label: 'اسبوعي' },
  { value: 'monthly', label: 'شهري' },
  { value: 'yearly', label: 'سنوي' },
];

const COMPANY_COLOR = '#0583ec';
const USER_COLOR = '#f5a623';
const GRID_COLOR = '#f1f5f9';
const MARKER_FILL_OPACITY = 0.18;

@Component({
  selector: 'app-overview',
  imports: [
    DecimalPipe,
    ChartComponent,
    StatCard,
    ChartPanel,
    ErrorState,
    ActionCenter,
    RecentPlacesTable,
  ],
  templateUrl: './overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  protected readonly store = inject(DashboardStore);

  protected readonly revenuePeriods = REVENUE_PERIODS;
  protected readonly growthPeriods = GROWTH_PERIODS;

  protected readonly revenueChart = computed(() => {
    const series = this.store.revenueSeries();
    return {
      chart: { type: 'area' as const, toolbar: { show: false }, height: 230 },
      series: [{ name: series?.name ?? '', data: (series?.points ?? []).map((p) => p.value) }],
      xaxis: {
        categories: (series?.points ?? []).map((p) => p.label),
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      // The design's revenue chart is a bare wave: no value axis, only faint month rules.
      yaxis: { show: false },
      grid: {
        borderColor: GRID_COLOR,
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: false } },
      },
      legend: { show: false },
      stroke: { curve: 'smooth' as const, width: 3 },
      colors: [COMPANY_COLOR],
      dataLabels: { enabled: false },
    };
  });

  protected readonly growthChart = computed(() => {
    const [companies, users] = this.store.growthSeries();
    return {
      chart: { type: 'area' as const, toolbar: { show: false }, height: 230 },
      series: [
        { name: companies?.name ?? '', data: (companies?.points ?? []).map((p) => p.value) },
        { name: users?.name ?? '', data: (users?.points ?? []).map((p) => p.value) },
      ],
      xaxis: {
        categories: (companies?.points ?? []).map((p) => p.label),
        axisBorder: { show: false },
        axisTicks: { show: false },
      },
      // The design draws straight segments, a tinted area and a hollow dot per point.
      yaxis: { show: true, min: 0, tickAmount: 3, forceNiceScale: true },
      grid: { borderColor: GRID_COLOR },
      legend: { show: true, position: 'bottom' as const, horizontalAlign: 'center' as const },
      stroke: { curve: 'straight' as const, width: 2 },
      fill: { type: 'solid' as const, opacity: MARKER_FILL_OPACITY },
      markers: {
        size: 5,
        strokeWidth: 2,
        colors: ['#ffffff'],
        strokeColors: [COMPANY_COLOR, USER_COLOR],
        hover: { sizeOffset: 2 },
      },
      colors: [COMPANY_COLOR, USER_COLOR],
      dataLabels: { enabled: false },
    };
  });

  constructor() {
    this.store.loadDashboard();
  }

  protected onRevenuePeriodChange(period: string): void {
    this.store.setRevenuePeriod(period as ChartPeriod);
  }

  protected onGrowthPeriodChange(period: string): void {
    this.store.setGrowthPeriod(period as ChartPeriod);
  }
}
