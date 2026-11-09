import { CsvRow, buildCsvFile, buildCsvText } from '../../../shared/files/csv-file';
import { REPORT_CARD_TITLES } from '../models/report-card-titles';
import { ReportSnapshot } from '../models/report-snapshot';

const HEADER: CsvRow = ['القسم', 'البند', 'القيمة', 'النسبة'];
const NO_VALUE = '';

function formatPercent(share: number): string {
  return `${share}%`;
}

function buildRows(snapshot: ReportSnapshot): readonly CsvRow[] {
  return [
    HEADER,
    ...snapshot.categoryShares.map((category) => [
      REPORT_CARD_TITLES.categoryShares,
      category.categoryName,
      NO_VALUE,
      formatPercent(category.share),
    ]),
    ...snapshot.usageMetrics.map((metric) => [
      REPORT_CARD_TITLES.usageMetrics,
      metric.label,
      `${metric.count}`,
      formatPercent(metric.share),
    ]),
    ...snapshot.governorateActivities.map((activity) => [
      REPORT_CARD_TITLES.governorateActivities,
      activity.governorateName,
      `${activity.visitCount}`,
      formatPercent(activity.share),
    ]),
    ...snapshot.growthSeries.flatMap((series) =>
      series.points.map((point) => [
        REPORT_CARD_TITLES.growth,
        `${series.name} - ${point.label}`,
        `${point.value}`,
        NO_VALUE,
      ]),
    ),
    ...(snapshot.revenueSeries?.points ?? []).map((point) => [
      REPORT_CARD_TITLES.revenue,
      point.label,
      `${point.value}`,
      NO_VALUE,
    ]),
  ];
}

export function buildReportsCsvText(snapshot: ReportSnapshot): string {
  return buildCsvText(buildRows(snapshot));
}

export function buildReportsCsvFile(snapshot: ReportSnapshot): Blob {
  return buildCsvFile(buildRows(snapshot));
}
