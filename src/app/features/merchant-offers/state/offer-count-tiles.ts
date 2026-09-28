import { CountTile } from '../../../shared/models/count-tile';
import { MerchantOffer } from '../models/merchant-offer';

/** Total first, so RTL lays the tiles out right to left as the frame does. */
export function countOffers(offers: readonly MerchantOffer[]): readonly CountTile[] {
  const countWith = (status: MerchantOffer['status']) =>
    offers.filter((offer) => offer.status === status).length;
  return [
    { label: 'إجمالي العروض منذ الانضمام', count: offers.length },
    { label: 'العروض النشطة', count: countWith('active') },
    { label: 'العروض المنتهية', count: countWith('expired') },
  ];
}
