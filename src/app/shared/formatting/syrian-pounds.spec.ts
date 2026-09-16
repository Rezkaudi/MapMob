import { formatSyrianPounds } from './syrian-pounds';

describe('formatSyrianPounds', () => {
  it('writes the amount before "ل.س", with thousands grouped', () => {
    expect(formatSyrianPounds(200)).toBe('200 ل.س');
    expect(formatSyrianPounds(12500)).toBe('12,500 ل.س');
  });
});
