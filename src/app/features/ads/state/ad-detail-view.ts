import { formatLatinDigitDate } from '../../../shared/formatting/latin-digit-date';
import { AdDetail } from '../models/ad-detail';
import { AD_CONTENT_TYPE_LABEL } from '../models/ad-content-type';
import { AD_PLACEMENT_LABEL } from '../models/ad-placement';
import { AD_POSITION_LABEL } from '../models/ad-position';
import { AdPauseAction } from '../models/ad-pause-action';
import { AdMetricCard, buildAdMetricCards } from './ad-metric-cards';
import { adPauseActionFor } from './ad-pause-action';
import { adPriorityRankLabel } from './ad-priority-rank-label';
import { formatAdPlace } from './ad-place-label';

const NO_END_LABEL = 'غير محدد';

/** Everything the detail page reads, already named in Arabic. */
export interface AdDetailView {
  readonly pauseAction: AdPauseAction | null;
  readonly createdOnLabel: string;
  readonly placeLabel: string;
  /** `null` for an ad the app's own team runs: there is no store page to open. */
  readonly placeLink: string | null;
  /** The one-line "page (position)" the overview card writes. */
  readonly appPlacementLabel: string;
  readonly contentTypeLabel: string;
  readonly placementLabel: string;
  readonly priorityLabel: string;
  readonly updatedByLabel: string;
  readonly startsOnLabel: string;
  readonly endsOnLabel: string;
  readonly metricCards: readonly AdMetricCard[];
}

export function buildAdDetailView(detail: AdDetail): AdDetailView {
  const { ad } = detail;
  const placement = AD_PLACEMENT_LABEL[ad.placement];
  const position = AD_POSITION_LABEL[detail.position];
  return {
    pauseAction: adPauseActionFor(ad.status),
    createdOnLabel: `تاريخ الإنشاء: ${formatLatinDigitDate(detail.createdOn)}`,
    placeLabel: formatAdPlace(ad),
    placeLink: detail.placeId === null ? null : `/places/${detail.placeId}`,
    appPlacementLabel: `${placement} (${position})`,
    contentTypeLabel: AD_CONTENT_TYPE_LABEL[ad.contentType],
    placementLabel: `${placement} - ${position}`,
    priorityLabel: adPriorityRankLabel(ad.priority),
    updatedByLabel: `${detail.updatedBy} - ${formatLatinDigitDate(detail.updatedOn)}`,
    startsOnLabel: formatLatinDigitDate(ad.startsOn),
    endsOnLabel: ad.endsOn === null ? NO_END_LABEL : formatLatinDigitDate(ad.endsOn),
    metricCards: buildAdMetricCards(detail.metrics),
  };
}
