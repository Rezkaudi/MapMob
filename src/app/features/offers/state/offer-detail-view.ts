import { CampaignPauseAction } from '../../../shared/models/campaign-pause-action';
import { campaignPauseActionFor } from '../../../shared/state/campaign-pause-action';
import { OfferDetail } from '../models/offer-detail';

const ARABIC_ARTICLE = 'ال';

export interface OfferDetailView {
  readonly placeInitial: string;
  readonly pauseAction: CampaignPauseAction | null;
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
    pauseAction: campaignPauseActionFor(detail.offer.status),
  };
}
