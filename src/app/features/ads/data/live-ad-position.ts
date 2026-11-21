import { AdPosition } from '../models/ad-position';

const LIVE_AD_POSITION: Record<AdPosition, string> = {
  topBanner: 'top',
  middleBanner: 'middle',
  bottomBanner: 'bottom',
};

const DEFAULT_AD_POSITION: AdPosition = 'topBanner';

export function toLiveAdPosition(position: AdPosition): string {
  return LIVE_AD_POSITION[position];
}

/** Answers that leave the position out read as the top banner. */
export function toAdPosition(livePosition: string | null | undefined): AdPosition {
  const match = (Object.keys(LIVE_AD_POSITION) as AdPosition[]).find(
    (position) => LIVE_AD_POSITION[position] === livePosition,
  );
  return match ?? DEFAULT_AD_POSITION;
}
