import { MOCK_PLACES } from '../../../../mock/mock-places';
import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { addCalendarDays, toCalendarDay } from '../../../shared/formatting/calendar-day';
import { CampaignStatus } from '../../../shared/models/campaign-status';
import { resolveRunningStatus } from '../../../shared/state/campaign-running-status';
import { AdContentType } from '../models/ad-content-type';
import { AdDetail } from '../models/ad-detail';
import { AdPlacement } from '../models/ad-placement';
import { AdPosition } from '../models/ad-position';
import { AD_PRIORITIES } from '../models/ad-priority';
import { buildDesignSampleAds } from './ad-mock-samples';

const EARLIEST_START_DAYS = -120;
const LATEST_START_DAYS = 60;
const SHORTEST_AD_DAYS = 7;
const LONGEST_AD_DAYS = 60;
const DRAFT_SHARE = 0.05;
const PAUSED_SHARE = 0.1;
const ADMIN_SHARE = 0.2;
const ONGOING_SHARE = 0.1;
const VIDEO_SHARE = 0.3;

const TITLES = [
  'حملة الصيف',
  'خصومات نهاية الموسم',
  'افتتاح الفرع الجديد',
  'عرض العودة إلى المدارس',
];
const ADMIN_TITLES = ['حمّل التطبيق وشارك تجربتك', 'أضف متجرك إلى MapMob مجاناً'];
const TEXTS = ['خصم على مجموعة مختارة طوال الأسبوع.', 'تابعونا لمعرفة كل جديد.'];
const PLACEMENTS: readonly AdPlacement[] = ['home', 'searchResults', 'categories', 'placeDetails'];
const POSITIONS: readonly AdPosition[] = ['topBanner', 'middleBanner', 'bottomBanner'];

function pickStatus(
  next: () => number,
  startsOn: string,
  endsOn: string | null,
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

function buildAdDetail(index: number, today: string): AdDetail {
  const next = createSeededRandom(index + 1);
  const isAdmin = next() < ADMIN_SHARE;
  const place = isAdmin ? null : pickOne(next, MOCK_PLACES);
  const startsOn = addCalendarDays(today, randomInt(next, EARLIEST_START_DAYS, LATEST_START_DAYS));
  const endsOn =
    next() < ONGOING_SHARE
      ? null
      : addCalendarDays(startsOn, randomInt(next, SHORTEST_AD_DAYS, LONGEST_AD_DAYS));
  const contentType: AdContentType = next() < VIDEO_SHARE ? 'video' : 'image';
  return {
    ad: {
      id: `ad-${index + 1}`,
      title: pickOne(next, isAdmin ? ADMIN_TITLES : TITLES),
      advertiserType: isAdmin ? 'admin' : 'place',
      placeName: place?.name ?? null,
      contentType,
      placement: pickOne(next, PLACEMENTS),
      priority: pickOne(next, AD_PRIORITIES),
      startsOn,
      endsOn,
      status: pickStatus(next, startsOn, endsOn, today),
    },
    placeId: place?.id ?? null,
    position: pickOne(next, POSITIONS),
    text: pickOne(next, TEXTS),
    mediaUrl: null,
  };
}

/** Deterministic ads placed in time relative to `now`, led by the design's four rows. */
export function buildAdSeed(now: Date, adCount: number): AdDetail[] {
  const today = toCalendarDay(now);
  const samples = buildDesignSampleAds(today);
  return Array.from({ length: adCount }, (_, index) =>
    index < samples.length ? samples[index] : buildAdDetail(index, today),
  );
}
