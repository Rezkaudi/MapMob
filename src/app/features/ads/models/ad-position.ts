/** Where on its page the ad sits. */
export type AdPosition = 'topBanner' | 'middleBanner' | 'bottomBanner';

export const AD_POSITION_LABEL: Record<AdPosition, string> = {
  topBanner: 'البانر الرئيسي العلوي',
  middleBanner: 'بانر منتصف الصفحة',
  bottomBanner: 'بانر أسفل الصفحة',
};
