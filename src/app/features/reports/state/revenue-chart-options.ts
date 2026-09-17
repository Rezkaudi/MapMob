import { escapeHtml } from '../../../shared/formatting/escaped-html';
import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { ChartSeries } from '../../../shared/models/chart-series';
import { AreaChartOptions } from '../models/area-chart-options';
import { PRIMARY_BLUE } from './chart-colors';

const CHART_HEIGHT = 248;
const RULE_COLOR = '#eeeeee';
const RULE_DASH = 4;
const MONTH_TEXT_COLOR = '#8181a5';
const WAVE_TINT = '#5e81f4';
const WAVE_TINT_OPACITY = 0.15;
const WAVE_WIDTH = 2.5;
const HEADROOM_RATIO = 4 / 3;
const HOVER_DOT_SIZE = 6;
const HOVER_HALO_WIDTH = 4;
const HOVER_HALO_OPACITY = 0.5;

interface TooltipContext {
  readonly dataPointIndex: number;
  readonly seriesIndex: number;
  readonly series: number[][];
}

/** The white card from the design: the point label over the bold amount. */
export function buildRevenueTooltip(label: string, amount: number): string {
  return (
    `<div class="revenue-tooltip flex flex-col px-[23.6px] py-[7px] text-start">` +
    `<span class="text-[14px]/[21px] text-text-secondary" dir="ltr">${escapeHtml(label)}</span>` +
    `<span class="text-[14px]/[21px] font-bold text-text-primary" dir="ltr">$${formatGroupedNumber(amount)}</span>` +
    `</div>`
  );
}

export function buildRevenueChartOptions(series: ChartSeries | null): AreaChartOptions {
  const points = series?.points ?? [];
  const labels = points.map((point) => point.label);
  const highestValue = Math.max(0, ...points.map((point) => point.value));

  return {
    chart: {
      type: 'area',
      height: CHART_HEIGHT,
      toolbar: { show: false },
      zoom: { enabled: false },
      parentHeightOffset: 0,
      fontFamily: 'inherit',
    },
    series: [{ name: series?.name ?? '', data: points.map((point) => point.value) }],
    xaxis: {
      categories: labels,
      axisBorder: { show: true, color: RULE_COLOR },
      axisTicks: { show: false },
      labels: {
        offsetY: 4,
        style: { colors: MONTH_TEXT_COLOR, fontSize: '14px', fontFamily: 'Lato' },
      },
      tooltip: { enabled: false },
      crosshairs: { show: false },
    },
    yaxis: { show: false, min: 0, max: highestValue * HEADROOM_RATIO },
    grid: {
      borderColor: RULE_COLOR,
      strokeDashArray: RULE_DASH,
      padding: { top: -10, left: 27, right: 27 },
      xaxis: { lines: { show: true } },
      yaxis: { lines: { show: false } },
    },
    legend: { show: false },
    stroke: { curve: 'smooth', width: WAVE_WIDTH },
    fill: {
      type: 'gradient',
      gradient: {
        type: 'vertical',
        colorStops: [
          { offset: 0, color: WAVE_TINT, opacity: WAVE_TINT_OPACITY },
          { offset: 100, color: '#ffffff', opacity: 0 },
        ],
      },
    },
    markers: {
      size: 0,
      strokeColors: PRIMARY_BLUE,
      strokeOpacity: HOVER_HALO_OPACITY,
      strokeWidth: HOVER_HALO_WIDTH,
      hover: { size: HOVER_DOT_SIZE },
    },
    colors: [PRIMARY_BLUE],
    dataLabels: { enabled: false },
    tooltip: {
      custom: ({ dataPointIndex, seriesIndex, series: values }: TooltipContext) =>
        buildRevenueTooltip(labels[dataPointIndex] ?? '', values[seriesIndex][dataPointIndex]),
    },
  };
}
