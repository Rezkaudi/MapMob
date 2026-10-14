import { AdPlacement } from '../models/ad-placement';

/** The server refuses "category" today, though its form options list it. */
const LIVE_AD_PLACEMENT: Record<AdPlacement, string> = {
  home: 'home',
  searchResults: 'search',
  categories: 'category',
  placeDetails: 'store',
};

const DEFAULT_AD_PLACEMENT: AdPlacement = 'home';

export function toLiveAdPlacement(placement: AdPlacement): string {
  return LIVE_AD_PLACEMENT[placement];
}

export function toAdPlacement(livePlacement: string): AdPlacement {
  const match = (Object.keys(LIVE_AD_PLACEMENT) as AdPlacement[]).find(
    (placement) => LIVE_AD_PLACEMENT[placement] === livePlacement,
  );
  return match ?? DEFAULT_AD_PLACEMENT;
}
