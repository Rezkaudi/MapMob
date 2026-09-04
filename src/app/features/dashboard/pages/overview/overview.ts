import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ChartComponent } from 'ng-apexcharts';
import { LucideBanknote, LucideBuilding2, LucideClock, LucideUsers } from '@lucide/angular';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { Badge } from '../../../../shared/ui/badge/badge';
import { BadgeTone } from '../../../../shared/ui/badge/badge';
import { StarRating } from '../../../../shared/ui/star-rating/star-rating';
import { DashboardStore } from '../../state/dashboard.store';
import { ActionItemTone } from '../../models/action-item';
import { PLACE_STATUS_LABEL, PlaceStatus } from '../../models/recent-place';
import { ChartPeriod } from '../../data/dashboard.repository';

const ACTION_TONE_CLASSES: Record<ActionItemTone, string> = {
  error: 'bg-error-soft text-error',
  warning: 'bg-warning-soft text-warning',
  info: 'bg-info-soft text-info',
  success: 'bg-success-soft text-success',
};

const PLACE_STATUS_TONE: Record<PlaceStatus, BadgeTone> = {
  active: 'success',
  suspended: 'error',
  pending: 'warning',
};

const PERIODS: readonly { readonly value: ChartPeriod; readonly label: string }[] = [
  { value: 'daily', label: 'يومي' },
  { value: 'weekly', label: 'اسبوعي' },
  { value: 'monthly', label: 'شهري' },
];

@Component({
  selector: 'app-overview',
  imports: [DecimalPipe, ChartComponent, StatCard, Badge, StarRating],
  templateUrl: './overview.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Overview {
  protected readonly store = inject(DashboardStore);

  protected readonly revenueIcon = LucideBanknote;
  protected readonly clockIcon = LucideClock;
  protected readonly buildingIcon = LucideBuilding2;
  protected readonly usersIcon = LucideUsers;

  protected readonly periods = PERIODS;
  protected readonly actionToneClasses = ACTION_TONE_CLASSES;
  protected readonly placeStatusLabel = PLACE_STATUS_LABEL;
  protected readonly placeStatusTone = PLACE_STATUS_TONE;

  protected readonly revenueChart = computed(() => {
    const series = this.store.revenueSeries();
    return {
      chart: { type: 'area' as const, toolbar: { show: false }, height: 260 },
      series: [{ name: series?.name ?? '', data: (series?.points ?? []).map((p) => p.value) }],
      xaxis: { categories: (series?.points ?? []).map((p) => p.label) },
      stroke: { curve: 'smooth' as const, width: 3 },
      colors: ['#0583ec'],
      dataLabels: { enabled: false },
    };
  });

  protected readonly growthChart = computed(() => {
    const [companies, users] = this.store.growthSeries();
    const categories = (companies?.points ?? []).map((p) => p.label);
    return {
      chart: { type: 'line' as const, toolbar: { show: false }, height: 260 },
      series: [
        { name: companies?.name ?? '', data: (companies?.points ?? []).map((p) => p.value) },
        { name: users?.name ?? '', data: (users?.points ?? []).map((p) => p.value) },
      ],
      xaxis: { categories },
      stroke: { curve: 'smooth' as const, width: 2 },
      colors: ['#0583ec', '#f5a623'],
      dataLabels: { enabled: false },
    };
  });

  constructor() {
    this.store.loadDashboard();
  }

  protected onPeriodChange(period: ChartPeriod): void {
    this.store.setPeriod(period);
  }
}
