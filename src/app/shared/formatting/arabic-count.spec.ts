import { DAY_WORDS, formatArabicCount } from './arabic-count';

describe('formatArabicCount', () => {
  it('uses the word alone for one and two, and a number before it from three', () => {
    expect(formatArabicCount(1, DAY_WORDS)).toBe('يوم');
    expect(formatArabicCount(2, DAY_WORDS)).toBe('يومين');
    expect(formatArabicCount(7, DAY_WORDS)).toBe('7 أيام');
    expect(formatArabicCount(33, DAY_WORDS)).toBe('33 يوماً');
  });
});
