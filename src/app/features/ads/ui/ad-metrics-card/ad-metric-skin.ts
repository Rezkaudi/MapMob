import { AdMetricKind } from '../../state/ad-metric-cards';

export interface AdMetricSkin {
  readonly icon: string;
  /** The rounded tile behind the glyph, and the glyph's own colour. */
  readonly tile: string;
  readonly value: string;
}

const DARK_VALUE = 'text-text-primary';

export const AD_METRIC_SKINS: Record<AdMetricKind, AdMetricSkin> = {
  impressions: { icon: 'eye-outline', tile: 'bg-primary-tint text-primary', value: DARK_VALUE },
  clicks: {
    icon: 'pointer-click',
    tile: 'bg-status-success/16 text-status-success',
    value: DARK_VALUE,
  },
  clickRate: {
    icon: 'bar-chart',
    tile: 'bg-[rgba(243,232,255,0.7)] text-[#7e22ce]',
    value: 'text-primary',
  },
  uniqueUsers: {
    icon: 'users-outline',
    tile: 'bg-[rgba(198,124,0,0.16)] text-[#c67c00]',
    value: DARK_VALUE,
  },
};
