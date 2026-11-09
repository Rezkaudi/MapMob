import { ChartPeriod } from '../../../shared/models/chart-period';

/** The period each chart card shows, so the file holds what the page shows. */
export interface ReportExportRequest {
  readonly growthPeriod: ChartPeriod;
  readonly usagePeriod: ChartPeriod;
  readonly revenuePeriod: ChartPeriod;
}
