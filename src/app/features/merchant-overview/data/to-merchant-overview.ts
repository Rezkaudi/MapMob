import { MerchantOverview } from '../models/merchant-overview';
import { MerchantSubscription } from '../models/merchant-subscription';
import { LiveOwnerCurrentSubscription } from './live-owner-current-subscription';
import { LiveOwnerOverviewParts } from './live-owner-overview-parts';
import { toMerchantActivity } from './to-merchant-activity';
import { toMerchantReview } from './to-merchant-review';

const DAY_LENGTH = 'yyyy-mm-dd'.length;

// The server sends no change against the last 30 days yet, so the cards show 0%.
const NO_CHANGE_PERCENT = 0;

export function toMerchantOverview(parts: LiveOwnerOverviewParts): MerchantOverview {
  const { summary } = parts;
  return {
    placeName: summary.place.name,
    stats: {
      viewCount: summary.views.value,
      viewChangePercent: NO_CHANGE_PERCENT,
      searchAppearanceCount: summary.searchAppearances ?? 0,
      searchAppearanceChangePercent: NO_CHANGE_PERCENT,
      favoriteCount: summary.favorites,
      averageRating: summary.rating.average,
      reviewCount: summary.rating.reviewCount,
    },
    activities: parts.interactions.map(toMerchantActivity),
    latestReviews: parts.reviews.map(toMerchantReview),
    subscription: parts.subscription && toMerchantSubscription(parts.subscription),
  };
}

function toMerchantSubscription(current: LiveOwnerCurrentSubscription): MerchantSubscription {
  return {
    plan: { id: current.plan.id, name: current.plan.name },
    startsOn: current.startsAt.slice(0, DAY_LENGTH),
    endsOn: current.endsAt.slice(0, DAY_LENGTH),
    features: current.plan.features,
  };
}
