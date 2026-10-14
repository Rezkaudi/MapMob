import { PackagePlan } from './package-plan';

/** What the add dialog starts from: an empty, active monthly package. */
export const NEW_PLAN_TEMPLATE: PackagePlan = {
  id: '',
  name: '',
  tier: 'basic',
  tagline: '',
  badge: null,
  monthlyPrice: 0,
  yearlyPrice: null,
  currency: 'SYP',
  subscriberCount: 0,
  limits: { adsPerMonth: null, activeOffers: null, galleryImages: null, videos: null },
  features: [],
  isActive: true,
};
