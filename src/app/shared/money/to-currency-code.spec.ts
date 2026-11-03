import { toCurrencyCode } from './to-currency-code';

describe('toCurrencyCode', () => {
  it('keeps a currency the app knows', () => {
    expect(toCurrencyCode('USD')).toBe('USD');
    expect(toCurrencyCode('SYP')).toBe('SYP');
  });

  it('reads the same currency written in small letters or as its sign', () => {
    expect(toCurrencyCode('usd')).toBe('USD');
    expect(toCurrencyCode('$')).toBe('USD');
    expect(toCurrencyCode('syp')).toBe('SYP');
    expect(toCurrencyCode(' USD ')).toBe('USD');
  });

  it('falls back to the Syrian pound for anything else', () => {
    expect(toCurrencyCode('ل.س')).toBe('SYP');
    expect(toCurrencyCode(null)).toBe('SYP');
  });
});
