import { CurrencySymbolPipe } from './currency-symbol.pipe';

describe('CurrencySymbolPipe', () => {
  const pipe = new CurrencySymbolPipe();

  it('turns a currency code into the sign the design shows', () => {
    expect(pipe.transform('SYP')).toBe('ل.س');
    expect(pipe.transform('USD')).toBe('$');
  });
});
