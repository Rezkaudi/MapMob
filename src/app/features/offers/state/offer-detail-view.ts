import { OfferDetail } from '../models/offer-detail';
import { CampaignStatus } from '../../../shared/models/campaign-status';

const ARABIC_ARTICLE = 'ال';

/** Which of "إيقاف العرض" or "تفعيل العرض" the drawer footer offers, if either. */
export type OfferPauseAction = 'pause' | 'resume';

const PAUSE_ACTION_BY_STATUS: Record<CampaignStatus, OfferPauseAction | null> = {
  active: 'pause',
  scheduled: 'pause',
  paused: 'resume',
  expired: null,
  draft: null,
};

export interface OfferDetailView {
  readonly placeInitial: string;
  readonly pauseAction: OfferPauseAction | null;
}

/** The letter on the store tile: "ألبسة الجمال" shows "ج". */
export function getPlaceInitial(placeName: string): string {
  const lastWord = placeName.trim().split(/\s+/).at(-1) ?? '';
  const hasArticle = lastWord.startsWith(ARABIC_ARTICLE) && lastWord.length > ARABIC_ARTICLE.length;
  return (hasArticle ? lastWord.slice(ARABIC_ARTICLE.length) : lastWord).charAt(0);
}

export function buildOfferDetailView(detail: OfferDetail): OfferDetailView {
  return {
    placeInitial: getPlaceInitial(detail.place.name),
    pauseAction: PAUSE_ACTION_BY_STATUS[detail.offer.status],
  };
}
