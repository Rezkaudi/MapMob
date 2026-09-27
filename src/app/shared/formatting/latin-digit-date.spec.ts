import { formatLatinDigitDate } from './latin-digit-date';

describe('formatLatinDigitDate', () => {
  it('writes a calendar day with Latin digits and an Arabic month', () => {
    expect(formatLatinDigitDate('2026-01-15')).toBe('15 يناير 2026');
  });

  it('pads a single-digit day', () => {
    expect(formatLatinDigitDate('2026-09-02')).toBe('02 سبتمبر 2026');
  });
});
