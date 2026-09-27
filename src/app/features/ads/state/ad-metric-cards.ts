import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { AdMetrics } from '../models/ad-metrics';
import { formatAdClickRate } from './ad-click-rate';

export type AdMetricKind = 'impressions' | 'clicks' | 'clickRate' | 'uniqueUsers';

export interface AdMetricCard {
  readonly kind: AdMetricKind;
  readonly label: string;
  readonly value: string;
  /** Only the reach card carries a second line under its number. */
  readonly suffix: string;
}

const NO_SUFFIX = '';
const REACH_SUFFIX = 'مستمع / مشاهد';

/** RTL puts the first card top right, so the order below reads across the grid. */
export function buildAdMetricCards(metrics: AdMetrics): readonly AdMetricCard[] {
  return [
    {
      kind: 'impressions',
      label: 'مرات الظهور',
      value: formatGroupedNumber(metrics.impressions),
      suffix: NO_SUFFIX,
    },
    {
      kind: 'clicks',
      label: 'عدد النقرات',
      value: formatGroupedNumber(metrics.clicks),
      suffix: NO_SUFFIX,
    },
    {
      kind: 'clickRate',
      label: 'نسبة النقر (CTR)',
      value: formatAdClickRate(metrics),
      suffix: NO_SUFFIX,
    },
    {
      kind: 'uniqueUsers',
      label: 'المستخدمون',
      value: formatGroupedNumber(metrics.uniqueUsers),
      suffix: REACH_SUFFIX,
    },
  ];
}
