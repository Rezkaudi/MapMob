import { CampaignStatus } from '../../../shared/models/campaign-status';
import { PlanQuota } from '../../../shared/models/plan-quota';
import { QuotaNouns } from '../../../shared/models/quota-nouns';
import { describePlanQuota } from '../../../shared/state/plan-quota';
import { MerchantOffer } from '../models/merchant-offer';

const OFFER_QUOTA_NOUNS: QuotaNouns = {
  limitWords: { one: 'عرض', two: 'عرضين', few: 'عروض', many: 'عرضاً' },
  remainingWords: { one: 'عرض واحد', two: 'عرضان', few: 'عروض', many: 'عرضاً' },
  uncappedNotice: 'باقتك الحالية لا تحدّ عدد العروض النشطة.',
};

/** The plan limits live offers: running today or starting later. */
const LIVE_STATUSES: ReadonlySet<CampaignStatus> = new Set(['active', 'scheduled']);

export function countLiveOffers(offers: readonly MerchantOffer[]): number {
  return offers.filter((offer) => LIVE_STATUSES.has(offer.status)).length;
}

/** `limit` null is a plan with no cap. */
export function describeOfferQuota(
  offers: readonly MerchantOffer[],
  limit: number | null,
): PlanQuota {
  return describePlanQuota(countLiveOffers(offers), limit, OFFER_QUOTA_NOUNS);
}
