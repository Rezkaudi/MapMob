import { escapeHtml } from '../../../shared/formatting/escaped-html';
import { AreaChartOptions } from '../../reports/models/area-chart-options';
import { buildRevenueChartOptions } from '../../reports/state/revenue-chart-options';
import { StorePerformance } from '../models/store-performance';

const SERIES_NAME = 'المشاهدات';

interface TooltipContext {
  readonly dataPointIndex: number;
  readonly seriesIndex: number;
  readonly series: number[][];
}

/** The same white card as the revenue chart, holding a plain view count. */
export function buildStorePerformanceTooltip(label: string, viewCount: number): string {
  return (
    `<div class="revenue-tooltip flex flex-col px-[23.6px] py-[7px] text-start">` +
    `<span class="text-[14px]/[21px] text-text-secondary" dir="ltr">${escapeHtml(label)}</span>` +
    `<span class="text-[14px]/[21px] font-bold text-text-primary" dir="ltr">${viewCount}</span>` +
    `</div>`
  );
}

/** The merchant wave is drawn exactly like the reports revenue wave; only the tooltip differs. */
export function buildStorePerformanceChartOptions(
  performance: StorePerformance | null,
): AreaChartOptions {
  const points = performance?.points ?? [];
  const labels = points.map((point) => point.label);
  return {
    ...buildRevenueChartOptions({ name: SERIES_NAME, points }),
    tooltip: {
      custom: ({ dataPointIndex, seriesIndex, series }: TooltipContext) =>
        buildStorePerformanceTooltip(
          labels[dataPointIndex] ?? '',
          series[seriesIndex][dataPointIndex],
        ),
    },
  };
}
