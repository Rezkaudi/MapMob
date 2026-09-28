/** The four cards at the top of the overview, all for the last 30 days. */
export interface MerchantStats {
  readonly viewCount: number;
  /** Change against the 30 days before, in percent; negative when it fell. */
  readonly viewChangePercent: number;
  readonly searchAppearanceCount: number;
  readonly searchAppearanceChangePercent: number;
  readonly favoriteCount: number;
  /** 0–5, one decimal. */
  readonly averageRating: number;
  readonly reviewCount: number;
}
