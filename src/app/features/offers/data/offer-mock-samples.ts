import { addCalendarDays } from '../../../shared/formatting/calendar-day';
import { OfferDetail } from '../models/offer-detail';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { buildPlaceItems } from './offer-mock-items';
import { MOCK_PLACES } from '../../../../mock/mock-places';

const SAMPLE_TITLE = 'خصم 30% على جميع الأزياء الشتوية';
const SAMPLE_DESCRIPTION = 'احصل على خصم فوري بنسبة 30 % على كامل تشكيلة الشتاء لعام 2026.';
const SAMPLE_DISCOUNT_PERCENT = 30;
const SAMPLE_ITEM_COUNT = 2;

interface SampleRow {
  readonly status: CampaignStatus;
  /** Days from today to the first and the last day of the offer. */
  readonly startsIn: number;
  readonly endsIn: number;
}

/** The design's four rows, in order; their days keep each status true on any day. */
const SAMPLE_ROWS: readonly SampleRow[] = [
  { status: 'active', startsIn: -14, endsIn: 14 },
  { status: 'scheduled', startsIn: 7, endsIn: 21 },
  { status: 'paused', startsIn: -14, endsIn: 14 },
  { status: 'active', startsIn: -3, endsIn: 11 },
];

export function buildDesignSampleOffers(today: string): OfferDetail[] {
  const [place] = MOCK_PLACES;
  return SAMPLE_ROWS.map((row, index) => ({
    offer: {
      id: `offer-${index + 1}`,
      title: SAMPLE_TITLE,
      placeName: place.name,
      categoryName: place.categoryName,
      startsOn: addCalendarDays(today, row.startsIn),
      endsOn: addCalendarDays(today, row.endsIn),
      status: row.status,
    },
    description: SAMPLE_DESCRIPTION,
    place,
    discountPercent: SAMPLE_DISCOUNT_PERCENT,
    scope: 'selectedItems',
    itemIds: buildPlaceItems(place.id)
      .slice(0, SAMPLE_ITEM_COUNT)
      .map((item) => item.id),
    imageUrl: null,
  }));
}
