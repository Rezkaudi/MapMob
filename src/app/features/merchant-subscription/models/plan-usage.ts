import { UsageCount } from './usage-count';

/** The four "استخدام الباقة" cards. */
export interface PlanUsage {
  readonly products: UsageCount;
  readonly galleryImages: UsageCount;
  readonly activeOffers: UsageCount;
  readonly adsThisMonth: UsageCount;
}
