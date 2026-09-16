import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { addCalendarDays, toCalendarDay } from '../../../shared/formatting/calendar-day';
import { OfferDetail } from '../models/offer-detail';
import { OfferScope } from '../models/offer-scope';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { resolveRunningStatus } from '../../../shared/state/campaign-running-status';
import { buildPlaceItems } from './offer-mock-items';
import { MOCK_PLACES } from '../../../../mock/mock-places';
import { buildDesignSampleOffers } from './offer-mock-samples';

const EARLIEST_START_DAYS = -120;
const LATEST_START_DAYS = 60;
const SHORTEST_OFFER_DAYS = 7;
const LONGEST_OFFER_DAYS = 45;
const DRAFT_SHARE = 0.05;
const PAUSED_SHARE = 0.1;
const DISCOUNT_STEP = 5;
const LOWEST_DISCOUNT_STEPS = 1;
const HIGHEST_DISCOUNT_STEPS = 12;
const ALL_ITEMS_SHARE = 0.5;
const MAX_PICKED_ITEMS = 4;

const OFFERS = [
  {
    title: 'خصم 30% على جميع الأزياء الشتوية',
    description: 'احصل على خصم فوري بنسبة 30 % على كامل تشكيلة الشتاء.',
  },
  {
    title: 'اشترِ قطعة واحصل على الثانية مجاناً',
    description: 'العرض يشمل القطع المختارة داخل المتجر فقط.',
  },
  {
    title: 'خصم 15% على الأدوية والمستحضرات',
    description: 'خصم على جميع المستحضرات عند الشراء من الفرع.',
  },
  { title: 'وجبة عائلية بسعر مميز', description: 'وجبة لأربعة أشخاص مع مشروبات بسعر مخفض.' },
  { title: 'قهوة مجانية مع كل حلوى', description: 'اطلب أي حلوى واحصل على كوب قهوة مجاناً.' },
  {
    title: 'اشتراك شهر مجاني عند التسجيل',
    description: 'سجل اشتراكاً سنوياً واحصل على شهر إضافي مجاناً.',
  },
];

function pickStatus(
  next: () => number,
  startsOn: string,
  endsOn: string,
  today: string,
): CampaignStatus {
  const roll = next();
  if (roll < DRAFT_SHARE) {
    return 'draft';
  }
  if (roll < DRAFT_SHARE + PAUSED_SHARE) {
    return 'paused';
  }
  return resolveRunningStatus({ startsOn, endsOn }, today);
}

function buildOfferDetail(index: number, today: string): OfferDetail {
  const next = createSeededRandom(index + 1);
  const startsOn = addCalendarDays(today, randomInt(next, EARLIEST_START_DAYS, LATEST_START_DAYS));
  const endsOn = addCalendarDays(
    startsOn,
    randomInt(next, SHORTEST_OFFER_DAYS, LONGEST_OFFER_DAYS),
  );
  const place = pickOne(next, MOCK_PLACES);
  const { title, description } = pickOne(next, OFFERS);
  const scope: OfferScope = next() < ALL_ITEMS_SHARE ? 'allItems' : 'selectedItems';
  const pickedItemCount = scope === 'selectedItems' ? randomInt(next, 1, MAX_PICKED_ITEMS) : 0;
  return {
    offer: {
      id: `offer-${index + 1}`,
      title,
      placeName: place.name,
      categoryName: place.categoryName,
      startsOn,
      endsOn,
      status: pickStatus(next, startsOn, endsOn, today),
    },
    description,
    place,
    discountPercent: randomInt(next, LOWEST_DISCOUNT_STEPS, HIGHEST_DISCOUNT_STEPS) * DISCOUNT_STEP,
    scope,
    itemIds: buildPlaceItems(place.id)
      .slice(0, pickedItemCount)
      .map((item) => item.id),
    imageUrl: null,
  };
}

/** Deterministic offers placed in time relative to `now`, led by the design's four rows. */
export function buildOfferSeed(now: Date, offerCount: number): OfferDetail[] {
  const today = toCalendarDay(now);
  const samples = buildDesignSampleOffers(today);
  return Array.from({ length: offerCount }, (_, index) =>
    index < samples.length ? samples[index] : buildOfferDetail(index, today),
  );
}
