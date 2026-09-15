import { LatinDigitDatePipe } from './latin-digit-date.pipe';

describe('LatinDigitDatePipe', () => {
  const pipe = new LatinDigitDatePipe();

  it('writes the date the detail page uses: two-digit day, Arabic month, Latin digits', () => {
    expect(pipe.transform('2026-09-02T08:00:00.000Z')).toBe('02 سبتمبر 2026');
  });

  it('returns an empty string when there is no date', () => {
    expect(pipe.transform(null)).toBe('');
  });
});
