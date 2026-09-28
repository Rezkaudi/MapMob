/**
 * `panel` is the dashboard card. The reports page draws three others:
 * `raised` (growth), `raised-short-shadow` (revenue) and `outlined` (usage bars).
 * `embedded` has no frame of its own: the merchant overview draws its card around it.
 */
export type ChartPanelAppearance =
  'panel' | 'raised' | 'raised-short-shadow' | 'outlined' | 'embedded';
