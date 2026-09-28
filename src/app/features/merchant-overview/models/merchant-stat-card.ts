/** One overview card, ready for `app-stat-card`. */
export interface MerchantStatCard {
  readonly icon: string;
  readonly label: string;
  readonly value: string;
  readonly valueDirection: 'ltr' | 'rtl';
  readonly caption: string;
  readonly delta: string | null;
}
