import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexFill,
  ApexGrid,
  ApexLegend,
  ApexMarkers,
  ApexStroke,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';

/** Every ApexCharts input an area chart on the reports page binds. */
export interface AreaChartOptions {
  readonly chart: ApexChart;
  readonly series: ApexAxisChartSeries;
  readonly xaxis: ApexXAxis;
  readonly yaxis: ApexYAxis;
  readonly grid: ApexGrid;
  readonly legend: ApexLegend;
  readonly stroke: ApexStroke;
  readonly fill: ApexFill;
  readonly markers: ApexMarkers;
  readonly colors: string[];
  readonly dataLabels: ApexDataLabels;
  readonly tooltip: ApexTooltip;
}
