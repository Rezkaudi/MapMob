import { formatArabicDate } from '../../../shared/formatting/arabic-date';
import { MerchantOffer } from '../models/merchant-offer';
import { MerchantOfferRow } from '../models/merchant-offer-row';
import { describeOfferScopeInTable } from './offer-scope-text';

export function toMerchantOfferRow(offer: MerchantOffer): MerchantOfferRow {
  return {
    offer,
    initial: offer.title.trim().charAt(0),
    scopeText: describeOfferScopeInTable(offer),
    startsText: formatArabicDate(offer.startsOn),
    endsText: formatArabicDate(offer.endsOn),
  };
}
