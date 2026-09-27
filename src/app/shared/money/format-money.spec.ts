import { formatMoney } from './format-money';

describe('formatMoney', () => {
  it('writes the amount before the Syrian pound sign, with thousands grouped', () => {
    expect(formatMoney(200, 'SYP')).toBe('200 ل.س');
    expect(formatMoney(12500, 'SYP')).toBe('12,500 ل.س');
  });

  it('writes the amount before the dollar sign', () => {
    expect(formatMoney(1500, 'USD')).toBe('1,500 $');
  });
});
