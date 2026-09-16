/** Who runs the ad: a registered store, or the app's own team. */
export type AdAdvertiserType = 'place' | 'admin';

/** How the filter panel names each one. */
export const AD_ADVERTISER_TYPE_LABEL: Record<AdAdvertiserType, string> = {
  place: 'الشركة',
  admin: 'الإدارة',
};
