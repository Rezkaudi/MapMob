import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { Place } from '../models/place';
import { PlacePackage } from '../models/place-package';
import { PlaceStatus } from '../models/place-status';

const TOTAL_PLACE_COUNT = 120;
const FIRST_PLACE_CODE = 1024;
const IMAGES = 'assets/images';
const NAMES = ['صيدلية الحياة', 'مطعم الأصالة', 'مقهى الزاوية', 'سوبر ماركت النور', 'عيادة الشفاء'];
const CATEGORIES = ['صيدلية', 'مطعم', 'مقهى', 'سوبر ماركت', 'عيادة'];
const CITIES = ['الرياض', 'جدة', 'الدمام'];
const STATUSES: readonly PlaceStatus[] = ['active', 'active', 'active', 'pending', 'suspended'];
const PACKAGES: readonly PlacePackage[] = ['free', 'basic', 'basic', 'premium'];
const MIN_RATING = 35;
const MAX_RATING = 50;
const RATING_SCALE = 10;
const FIRST_JOIN_DAY = 1;
const LAST_JOIN_DAY = 28;

function buildPlace(index: number): Place {
  const next = createSeededRandom(index + 1);
  return {
    id: `place-${index + 1}`,
    code: String(FIRST_PLACE_CODE + index),
    name: pickOne(next, NAMES),
    logoUrl: `${IMAGES}/place-logo.jpg`,
    category: pickOne(next, CATEGORIES),
    city: pickOne(next, CITIES),
    rating: randomInt(next, MIN_RATING, MAX_RATING) / RATING_SCALE,
    status: pickOne(next, STATUSES),
    package: pickOne(next, PACKAGES),
    joinedAt: new Date(2024, 0, randomInt(next, FIRST_JOIN_DAY, LAST_JOIN_DAY)).toISOString(),
  };
}

export function buildPlaceSeed(placeCount = TOTAL_PLACE_COUNT): readonly Place[] {
  return Array.from({ length: placeCount }, (_, index) => buildPlace(index));
}
