import { Ad } from '../models/ad';

const ADMIN_ADVERTISER_LABEL = 'إدارة التطبيق';

/** The "المكان" cell: the store's name, or the app's own team for its ads. */
export function formatAdPlace(ad: Pick<Ad, 'placeName'>): string {
  return ad.placeName ?? ADMIN_ADVERTISER_LABEL;
}
