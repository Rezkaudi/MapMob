import { LiveReference } from '../../../core/http/live-reference';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { CampaignSummary } from '../../../shared/models/campaign-summary';
import { resolveRunningStatus } from '../../../shared/state/campaign-running-status';
import { Offer } from '../models/offer';
import { OfferDetail } from '../models/offer-detail';
import { OfferFormOptions } from '../models/offer-form-options';
import { OfferPlace } from '../models/offer-place';
import { LiveOffer } from './live-offer';
import { LiveOfferFormOptions } from './live-offer-form-options';
import { LIVE_ACTIVE_OFFER_STATUS } from './live-offer-status';
import { LiveOfferSummary } from './live-offer-summary';

const ISO_DAY_LENGTH = 10;

function toDay(moment: string): string {
  return moment.slice(0, ISO_DAY_LENGTH);
}

function toOfferStatus(offer: LiveOffer, today: string): CampaignStatus {
  if (offer.status !== LIVE_ACTIVE_OFFER_STATUS) {
    return 'paused';
  }
  return resolveRunningStatus(
    { startsOn: toDay(offer.starts_at), endsOn: toDay(offer.ends_at) },
    today,
  );
}

// The server sends no category or address for the store of an offer yet.
function toOfferPlace(id: number | string, name: string): OfferPlace {
  return { id: String(id), name, categoryName: '', address: '' };
}

/** `today` is a calendar day written `yyyy-mm-dd`. */
export function toOffer(offer: LiveOffer, today: string): Offer {
  return {
    id: String(offer.id),
    title: offer.title,
    placeName: offer.store_name,
    categoryName: '',
    startsOn: toDay(offer.starts_at),
    endsOn: toDay(offer.ends_at),
    status: toOfferStatus(offer, today),
  };
}

export function toOfferDetail(offer: LiveOffer, today: string): OfferDetail {
  const productId = offer.scope.product_id ?? offer.product_id;
  return {
    offer: toOffer(offer, today),
    description: offer.description ?? '',
    place: toOfferPlace(offer.store_id, offer.store_name),
    discountPercent: Number.parseFloat(offer.discount_percentage) || 0,
    scope: productId === null ? 'allItems' : 'selectedItems',
    itemIds: productId === null ? [] : [String(productId)],
    imageUrl: offer.image,
  };
}

export function toCampaignSummary(summary: LiveOfferSummary): CampaignSummary {
  return {
    totalCount: summary.total,
    activeCount: summary.active,
    scheduledCount: summary.scheduled,
    endedCount: summary.expired_or_stopped,
  };
}

export function toOfferFormOptions(
  options: LiveOfferFormOptions,
  mainCategories: readonly LiveReference[],
): OfferFormOptions {
  return {
    places: options.stores.map((store) => toOfferPlace(store.id, store.name)),
    categoryNames: mainCategories.map((category) => category.name),
  };
}
