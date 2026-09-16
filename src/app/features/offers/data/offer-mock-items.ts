import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { OfferItem } from '../models/offer-item';

const ITEM_COUNT = 8;
const PRICE_STEP = 50;
const LOWEST_PRICE_STEPS = 2;
const HIGHEST_PRICE_STEPS = 40;
/** The design's first row reads "شامبو 1 · 200 ل.س". */
const FIRST_ITEM = { name: 'شامبو', price: 200 };
const ITEM_NAMES = ['شامبو', 'عطر', 'قميص', 'حذاء', 'وجبة', 'قهوة', 'اشتراك', 'كريم'];

function seedOf(placeId: string): number {
  return [...placeId].reduce((sum, character) => sum + character.charCodeAt(0), 0);
}

/** Deterministic products and services for a mock store. */
export function buildPlaceItems(placeId: string): readonly OfferItem[] {
  const next = createSeededRandom(seedOf(placeId));
  return Array.from({ length: ITEM_COUNT }, (_, index) => {
    const number = index + 1;
    const isFirst = index === 0;
    return {
      id: `${placeId}-item-${number}`,
      name: `${isFirst ? FIRST_ITEM.name : pickOne(next, ITEM_NAMES)} ${number}`,
      price: isFirst
        ? FIRST_ITEM.price
        : randomInt(next, LOWEST_PRICE_STEPS, HIGHEST_PRICE_STEPS) * PRICE_STEP,
    };
  });
}
