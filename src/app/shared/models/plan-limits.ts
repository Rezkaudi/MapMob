/** How much content one package allows. `null` means the tier does not cap it. */
export interface PlanLimits {
  readonly adsPerMonth: number | null;
  readonly activeOffers: number | null;
  readonly galleryImages: number | null;
  readonly videos: number | null;
}
