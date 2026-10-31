import { arabicTextOf } from '../../../shared/data/arabic-text-of';
import { LIVE_ACTIVE } from '../../../shared/data/live-owner-status';
import { toIsoDay } from '../../../shared/formatting/iso-day';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { resolveRunningStatus } from '../../../shared/state/campaign-running-status';
import { MerchantOffer } from '../models/merchant-offer';
import { LiveOwnerOffer } from './live-owner-offer';

/** `today` is a calendar day written `yyyy-mm-dd`. */
export function toMerchantOffer(offer: LiveOwnerOffer, today: string): MerchantOffer {
  const productId = offer.scope.productId ?? offer.productId;
  const startsOn = toIsoDay(offer.startsAt);
  const endsOn = toIsoDay(offer.endsAt);
  return {
    id: String(offer.id),
    title: titleOf(offer.title),
    description: offer.description || null,
    discountPercent: offer.discountPercentage ?? 0,
    scope: productId === null ? 'allItems' : 'selectedItems',
    itemIds: productId === null ? [] : [String(productId)],
    startsOn,
    endsOn,
    status: statusOf(offer.status, startsOn, endsOn, today),
    imageUrl: offer.imageUrl,
    createdAt: offer.createdAt,
  };
}

function titleOf(title: LiveOwnerOffer['title']): string {
  return typeof title === 'string' ? title : (arabicTextOf(title) ?? '');
}

// A draft is saved as inactive too, so it reads back as paused.
function statusOf(status: string, startsOn: string, endsOn: string, today: string): CampaignStatus {
  if (status !== LIVE_ACTIVE) {
    return 'paused';
  }
  return resolveRunningStatus({ startsOn, endsOn }, today);
}
