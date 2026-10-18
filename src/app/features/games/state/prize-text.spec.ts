import { GamePrize } from '../models/game-prize';
import { WonPrize } from '../models/won-prize';
import { describeBannerPrize, describeWonPrize, formatPrizeValue } from './prize-text';

const CASH: GamePrize = {
  kind: 'cash',
  value: { amount: 50000, currency: 'SYP' },
  sponsorName: null,
  maxWinnerCount: 10,
};
const VOUCHER: GamePrize = { ...CASH, kind: 'voucher', sponsorName: 'كافية النور' };

describe('prize text', () => {
  it('groups the amount and adds the currency sign', () => {
    expect(formatPrizeValue(CASH.value)).toBe('50,000 ل.س');
  });

  it('describes the banner prize by its value or its sponsor', () => {
    expect(describeBannerPrize(CASH)).toBe('50,000 ل.س جائزة نقدية');
    expect(describeBannerPrize(VOUCHER)).toBe('قسيمة شرائية مقدمة من كافية النور');
  });

  it('describes what one winner gets', () => {
    const cash: WonPrize = {
      kind: 'cash',
      value: { amount: 5000, currency: 'SYP' },
      sponsorName: null,
    };
    const voucher: WonPrize = { ...cash, kind: 'voucher', sponsorName: 'مطعم النور' };
    expect(describeWonPrize(cash)).toBe('جائزة مالية بقيمة 5,000 ل.س');
    expect(describeWonPrize(voucher)).toBe('قسيمة شرائية مقدمة من مطعم النور');
  });
});
