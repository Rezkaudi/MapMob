import { AdMetrics } from '../models/ad-metrics';

const PERCENT = 100;
const DECIMALS = 2;

/** "8.00%": the share of the people who saw the ad who then clicked it. */
export function formatAdClickRate(metrics: AdMetrics): string {
  const rate = metrics.impressions === 0 ? 0 : (metrics.clicks / metrics.impressions) * PERCENT;
  return `${rate.toFixed(DECIMALS)}%`;
}
