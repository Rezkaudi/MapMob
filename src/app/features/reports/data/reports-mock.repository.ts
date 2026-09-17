import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CHART_PERIOD_LABELS } from '../../../../mock/chart-period-labels';
import { mockResponse } from '../../../../mock/mock-delay';
import { createSeededRandom, randomInt } from '../../../../mock/random';
import { ChartPeriod } from '../../../shared/models/chart-period';
import { ChartSeries } from '../../../shared/models/chart-series';
import { CategoryShare } from '../models/category-share';
import { GovernorateActivity } from '../models/governorate-activity';
import { UsageMetric } from '../models/usage-metric';
import {
  CATEGORY_SHARES,
  GOVERNORATE_ACTIVITIES,
  MONTHLY_REVENUE,
  WEEKLY_ACTIVE_USERS,
  WEEKLY_NEW_USERS,
  WEEKLY_USAGE_METRICS,
} from './reports-mock-samples';
import { ReportsRepository } from './reports.repository';

const ACTIVE_USERS_NAME = 'المستخدمون النشطون';
const NEW_USERS_NAME = 'المستخدمون الجدد';
const REVENUE_NAME = 'الإيرادات';

/** How many weeks of usage each period holds, so longer periods count more. */
const WEEKS_IN_PERIOD: Record<ChartPeriod, number> = {
  daily: 1 / 7,
  weekly: 1,
  monthly: 4.3,
  yearly: 52,
};

const GROWTH_SEED = 21;
const REVENUE_SEED = 34;
const MIN_NEW_USERS = 10;
const MAX_NEW_USERS = 70;
const MIN_ACTIVE_USERS_LEAD = 15;
const MAX_ACTIVE_USERS_LEAD = 35;
const MIN_REVENUE = 9000;
const MAX_REVENUE = 50000;

function toSeries(name: string, labels: readonly string[], values: readonly number[]): ChartSeries {
  return { name, points: labels.map((label, index) => ({ label, value: values[index] })) };
}

function buildGrowthSeries(period: ChartPeriod): readonly ChartSeries[] {
  const labels = CHART_PERIOD_LABELS[period];
  if (period === 'weekly') {
    return [
      toSeries(ACTIVE_USERS_NAME, labels, WEEKLY_ACTIVE_USERS),
      toSeries(NEW_USERS_NAME, labels, WEEKLY_NEW_USERS),
    ];
  }
  const next = createSeededRandom(GROWTH_SEED + labels.length);
  const newUsers = labels.map(() => randomInt(next, MIN_NEW_USERS, MAX_NEW_USERS));
  const activeUsers = newUsers.map(
    (count) => count + randomInt(next, MIN_ACTIVE_USERS_LEAD, MAX_ACTIVE_USERS_LEAD),
  );
  return [
    toSeries(ACTIVE_USERS_NAME, labels, activeUsers),
    toSeries(NEW_USERS_NAME, labels, newUsers),
  ];
}

function buildRevenueSeries(period: ChartPeriod): ChartSeries {
  const labels = CHART_PERIOD_LABELS[period];
  if (period === 'monthly') {
    return toSeries(REVENUE_NAME, labels, MONTHLY_REVENUE);
  }
  const next = createSeededRandom(REVENUE_SEED + labels.length);
  return toSeries(
    REVENUE_NAME,
    labels,
    labels.map(() => randomInt(next, MIN_REVENUE, MAX_REVENUE)),
  );
}

function buildUsageMetrics(period: ChartPeriod): readonly UsageMetric[] {
  return WEEKLY_USAGE_METRICS.map((metric) => ({
    ...metric,
    count: Math.round(metric.count * WEEKS_IN_PERIOD[period]),
  }));
}

@Injectable()
export class ReportsMockRepository implements ReportsRepository {
  getCategoryShares(): Observable<readonly CategoryShare[]> {
    return mockResponse(CATEGORY_SHARES);
  }

  getGovernorateActivities(): Observable<readonly GovernorateActivity[]> {
    return mockResponse(GOVERNORATE_ACTIVITIES);
  }

  getGrowthSeries(period: ChartPeriod): Observable<readonly ChartSeries[]> {
    return mockResponse(buildGrowthSeries(period));
  }

  getUsageMetrics(period: ChartPeriod): Observable<readonly UsageMetric[]> {
    return mockResponse(buildUsageMetrics(period));
  }

  getRevenueSeries(period: ChartPeriod): Observable<ChartSeries> {
    return mockResponse(buildRevenueSeries(period));
  }
}
