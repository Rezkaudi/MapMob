export const MERCHANT_OFFERS_URL = '/merchant/offers';
export const NEW_MERCHANT_OFFER_URL = `${MERCHANT_OFFERS_URL}/new`;

export function editMerchantOfferUrl(offerId: string): string {
  return `${MERCHANT_OFFERS_URL}/${offerId}/edit`;
}
