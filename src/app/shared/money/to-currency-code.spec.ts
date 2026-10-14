import { toCurrencyCode } from './to-currency-code';

describe('toCurrencyCode', () => {
  it('keeps a currency the app knows', () => {
    expect(toCurrencyCode('USD')).toBe('USD');
    expect(toCurrencyCode('SYP')).toBe('SYP');
  });

  it('falls back to the Syrian pound for anything else', () => {
    expect(toCurrencyCode('ل.س')).toBe('SYP');
    expect(toCurrencyCode(null)).toBe('SYP');
  });
});
