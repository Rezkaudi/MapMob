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
export const WEEK_WORDS: CountWords = {
  one: 'أسبوع',
  two: 'أسبوعين',
  few: 'أسابيع',
  many: 'أسبوعاً',
};
export const MONTH_WORDS: CountWords = { one: 'شهر', two: 'شهرين', few: 'أشهر', many: 'شهراً' };
export const VIEW_WORDS: CountWords = {
  one: 'مشاهدة واحدة',
  two: 'مشاهدتين',
  few: 'مشاهدات',
  many: 'مشاهدة',
};
export const YEAR_WORDS: CountWords = { one: 'سنة', two: 'سنتين', few: 'سنوات', many: 'سنة' };

/** The noun alone, for text that writes the number itself: "/ 5 عروض". */
export function pickArabicCountWord(count: number, words: CountWords): string {
  if (count === 1) {
    return words.one;
  }
  if (count === 2) {
    return words.two;
  }
  return count <= LAST_PLURAL_COUNT ? words.few : words.many;
}

/** One and two are said by the noun alone ("يومين"); from three the number leads. */
export function formatArabicCount(count: number, words: CountWords): string {
  const word = pickArabicCountWord(count, words);
  return count === 1 || count === 2 ? word : `${count} ${word}`;
}
