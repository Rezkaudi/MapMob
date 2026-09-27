import { MOCK_PLACES } from '../../../../mock/mock-places';
import { addCalendarDays } from '../../../shared/formatting/calendar-day';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { AdContentType } from '../models/ad-content-type';
import { AdDetail } from '../models/ad-detail';
import { AdMetrics } from '../models/ad-metrics';
import { AdPlacement } from '../models/ad-placement';
import { AdPriority } from '../models/ad-priority';

const SAMPLE_TITLE = 'خصم 30% على جميع الأزياء الشتوية';
const SAMPLE_TEXT = 'خصم 30% على كامل تشكيلة الشتاء طوال الشهر الحالي.';
const SAMPLE_UPDATED_BY = 'Admin';
const SAMPLE_IMAGE_URL = 'assets/images/ad-banner-grill.png';
/** The frame writes the ad 11 days before it starts and changes it 5 days later. */
const CREATED_DAYS_BEFORE_START = 11;
const UPDATED_DAYS_BEFORE_START = 6;

interface SampleRow {
  readonly contentType: AdContentType;
  readonly placement: AdPlacement;
  readonly priority: AdPriority;
  readonly status: CampaignStatus;
  /** Days from today to the first and the last day of the ad. */
  readonly startsIn: number;
  readonly endsIn: number;
  readonly metrics: AdMetrics;
}

/** The design's four rows, in order; their days keep each status true on any day. */
const SAMPLE_ROWS: readonly SampleRow[] = [
  {
    contentType: 'image',
    placement: 'home',
    priority: 5,
    status: 'active',
    startsIn: -14,
    endsIn: 14,
    metrics: { impressions: 48250, clicks: 3860, uniqueUsers: 34120 },
  },
  {
    contentType: 'video',
    placement: 'searchResults',
    priority: 3,
    status: 'paused',
    startsIn: -14,
    endsIn: 14,
    metrics: { impressions: 21400, clicks: 1712, uniqueUsers: 15980 },
  },
  {
    contentType: 'image',
    placement: 'home',
    priority: 5,
    status: 'scheduled',
    startsIn: 7,
    endsIn: 21,
    metrics: { impressions: 0, clicks: 0, uniqueUsers: 0 },
  },
  {
    contentType: 'image',
    placement: 'home',
    priority: 5,
    status: 'active',
    startsIn: -3,
    endsIn: 11,
    metrics: { impressions: 9120, clicks: 638, uniqueUsers: 7305 },
  },
];

export function buildDesignSampleAds(today: string): AdDetail[] {
  const [place] = MOCK_PLACES;
  return SAMPLE_ROWS.map((row, index) => ({
    ad: {
      id: `ad-${index + 1}`,
      title: SAMPLE_TITLE,
      advertiserType: 'place',
      placeName: place.name,
      contentType: row.contentType,
      placement: row.placement,
      priority: row.priority,
      startsOn: addCalendarDays(today, row.startsIn),
      endsOn: addCalendarDays(today, row.endsIn),
      status: row.status,
    },
    placeId: place.id,
    position: 'topBanner',
    text: SAMPLE_TEXT,
    mediaUrl: row.contentType === 'image' ? SAMPLE_IMAGE_URL : null,
    createdOn: addCalendarDays(today, row.startsIn - CREATED_DAYS_BEFORE_START),
    updatedOn: addCalendarDays(today, row.startsIn - UPDATED_DAYS_BEFORE_START),
    updatedBy: SAMPLE_UPDATED_BY,
    metrics: row.metrics,
  }));
}
