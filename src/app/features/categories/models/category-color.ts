/**
 * The swatch row wraps, and RTL fills it from the right, so the first colour here is the
 * rightmost one the design draws.
 */
export const CATEGORY_COLORS = [
  '#FF8104',
  '#006F69',
  '#FC0303',
  '#03732B',
  '#5977FF',
  '#55B4AF',
  '#F4D400',
  '#0583EC',
  '#0F172A',
  '#10B981',
  '#1027B9',
  '#4B2996',
  '#D141DF',
] as const;

export type CategoryColor = (typeof CATEGORY_COLORS)[number];

export const DEFAULT_CATEGORY_COLOR: CategoryColor = '#0583EC';
