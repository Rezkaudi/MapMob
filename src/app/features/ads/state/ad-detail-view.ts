import { AdDetail } from '../models/ad-detail';
import { AD_CONTENT_TYPE_LABEL } from '../models/ad-content-type';
import { AD_PLACEMENT_LABEL } from '../models/ad-placement';
import { AD_POSITION_LABEL } from '../models/ad-position';
import { AdPauseAction } from '../models/ad-pause-action';
import { adPauseActionFor } from './ad-pause-action';
import { formatAdPeriod } from './ad-period-label';
import { formatAdPlace } from './ad-place-label';

/** Everything the detail drawer reads, already named in Arabic. */
export interface AdDetailView {
  readonly pauseAction: AdPauseAction | null;
  readonly placeLabel: string;
  readonly contentTypeLabel: string;
  readonly placementLabel: string;
  readonly positionLabel: string;
  readonly priorityLabel: string;
  readonly periodLabel: string;
}

export function buildAdDetailView(detail: AdDetail): AdDetailView {
  const { ad } = detail;
  return {
    pauseAction: adPauseActionFor(ad.status),
    placeLabel: formatAdPlace(ad),
    contentTypeLabel: AD_CONTENT_TYPE_LABEL[ad.contentType],
    placementLabel: AD_PLACEMENT_LABEL[ad.placement],
    positionLabel: AD_POSITION_LABEL[detail.position],
    priorityLabel: String(ad.priority),
    periodLabel: formatAdPeriod(ad.startsOn, ad.endsOn),
  };
}
