import { ChartSeries } from '../../../shared/models/chart-series';
import { AreaChartOptions } from '../models/area-chart-options';
import { ACCENT_ORANGE, MARKER_HOLLOW_FILL, PRIMARY_BLUE } from './chart-colors';
import { buildValueAxisScale } from './value-axis-scale';

const CHART_HEIGHT = 250;
const AREA_OPACITY = 0.15;
const AXIS_TEXT_COLOR = '#54555a';
const GRID_COLOR = '#dbdee4';
const AXIS_FONT_SIZE = '12px';
const LEGEND_FONT_SIZE = '14px';

/** Expects the active users first and the new users second, as the design stacks them. */
export function buildGrowthChartOptions(series: readonly ChartSeries[]): AreaChartOptions {
  const highestValue = Math.max(
    0,
    ...series.flatMap((line) => line.points.map((point) => point.value)),
  );
  const scale = buildValueAxisScale(highestValue);
  const axisLabelStyle = { colors: AXIS_TEXT_COLOR, fontSize: AXIS_FONT_SIZE };

  return {
    chart: {
      type: 'area',
      height: CHART_HEIGHT,
      toolbar: { show: false },
      zoom: { enabled: false },
      fontFamily: 'inherit',
    },
    series: series.map((line) => ({
      name: line.name,
      data: line.points.map((point) => point.value),
    })),
    xaxis: {
      categories: (series[0]?.points ?? []).map((point) => point.label),
      axisBorder: { show: true, color: AXIS_TEXT_COLOR },
      axisTicks: { show: true, color: AXIS_TEXT_COLOR },
      labels: { style: axisLabelStyle, offsetY: -5 },
      tooltip: { enabled: false },
    },
    yaxis: {
      min: 0,
      max: scale.max,
      tickAmount: scale.tickAmount,
      labels: { style: axisLabelStyle, offsetX: 48 },
    },
    grid: {
      borderColor: GRID_COLOR,
      padding: { top: 16, bottom: -11, left: 56, right: 41 },
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: {
      show: true,
      position: 'bottom',
      horizontalAlign: 'center',
      fontSize: LEGEND_FONT_SIZE,
      labels: { colors: AXIS_TEXT_COLOR },
      markers: { size: 7, shape: 'circle' },
      itemMargin: { horizontal: 12 },
      offsetY: -2,
    },
    stroke: { curve: 'straight', width: 2 },
    fill: { type: 'solid', opacity: AREA_OPACITY },
    markers: {
      size: [3.5, 3],
      strokeWidth: [2, 0],
      colors: [MARKER_HOLLOW_FILL, PRIMARY_BLUE],
      strokeColors: [ACCENT_ORANGE, PRIMARY_BLUE],
      hover: { sizeOffset: 2 },
    },
    colors: [ACCENT_ORANGE, PRIMARY_BLUE],
    dataLabels: { enabled: false },
    tooltip: { shared: true, intersect: false },
  };
}
