const LAST_PLURAL_COUNT = 10;

/** Arabic counts one, two, three to ten, and eleven up with different words. */
export interface CountWords {
  readonly one: string;
  readonly two: string;
  readonly few: string;
  readonly many: string;
}

export const MINUTE_WORDS: CountWords = {
  one: 'دقيقة',
  two: 'دقيقتين',
  few: 'دقائق',
  many: 'دقيقة',
};
export const HOUR_WORDS: CountWords = { one: 'ساعة', two: 'ساعتين', few: 'ساعات', many: 'ساعة' };
export const DAY_WORDS: CountWords = { one: 'يوم', two: 'يومين', few: 'أيام', many: 'يوماً' };
export const MONTH_WORDS: CountWords = { one: 'شهر', two: 'شهرين', few: 'أشهر', many: 'شهراً' };
export const YEAR_WORDS: CountWords = { one: 'سنة', two: 'سنتين', few: 'سنوات', many: 'سنة' };

export function formatArabicCount(count: number, words: CountWords): string {
  if (count === 1) {
    return words.one;
  }
  if (count === 2) {
    return words.two;
  }
  return `${count} ${count <= LAST_PLURAL_COUNT ? words.few : words.many}`;
}
