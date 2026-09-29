import {
  pickArabicCountWord,
  DAY_WORDS,
  WEEK_WORDS,
  formatArabicCount,
  VIEW_WORDS,
} from './arabic-count';

describe('formatArabicCount', () => {
  it('uses the word alone for one and two, and a number before it from three', () => {
    expect(formatArabicCount(1, DAY_WORDS)).toBe('يوم');
    expect(formatArabicCount(2, DAY_WORDS)).toBe('يومين');
    expect(formatArabicCount(7, DAY_WORDS)).toBe('7 أيام');
    expect(formatArabicCount(33, DAY_WORDS)).toBe('33 يوماً');
  });

  it('counts weeks', () => {
    expect(formatArabicCount(1, WEEK_WORDS)).toBe('أسبوع');
    expect(formatArabicCount(2, WEEK_WORDS)).toBe('أسبوعين');
    expect(formatArabicCount(3, WEEK_WORDS)).toBe('3 أسابيع');
  });

  it('counts views the way the merchant overview writes them', () => {
    expect(formatArabicCount(1, VIEW_WORDS)).toBe('مشاهدة واحدة');
    expect(formatArabicCount(5, VIEW_WORDS)).toBe('5 مشاهدات');
    expect(formatArabicCount(42, VIEW_WORDS)).toBe('42 مشاهدة');
    expect(formatArabicCount(142, VIEW_WORDS)).toBe('142 مشاهدة');
  });

  it('picks the noun alone, for text that writes the number itself', () => {
    expect(pickArabicCountWord(1, DAY_WORDS)).toBe('يوم');
    expect(pickArabicCountWord(2, DAY_WORDS)).toBe('يومين');
    expect(pickArabicCountWord(5, DAY_WORDS)).toBe('أيام');
    expect(pickArabicCountWord(20, DAY_WORDS)).toBe('يوماً');
  });
});
