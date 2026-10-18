import { formatMoney } from '../../../shared/money/format-money';
import { Money } from '../../../shared/money/money';
import { GamePrize } from '../models/game-prize';
import { WonPrize } from '../models/won-prize';

const CASH_BANNER_WORDS = 'جائزة نقدية';

export function formatPrizeValue(value: Money): string {
  return formatMoney(value.amount, value.currency);
}

function describeVoucher(sponsorName: string | null): string {
  return `قسيمة شرائية مقدمة من ${sponsorName ?? ''}`.trim();
}

/** "50,000 ل.س جائزة نقدية" or "قسيمة شرائية مقدمة من كافية النور". */
export function describeBannerPrize(prize: GamePrize): string {
  if (prize.kind === 'voucher') {
    return describeVoucher(prize.sponsorName);
  }
  return `${formatPrizeValue(prize.value)} ${CASH_BANNER_WORDS}`;
}

/** "جائزة مالية بقيمة 5,000 ل.س" or the voucher and who gives it. */
export function describeWonPrize(prize: WonPrize): string {
  if (prize.kind === 'voucher') {
    return describeVoucher(prize.sponsorName);
  }
  return `جائزة مالية بقيمة ${formatPrizeValue(prize.value)}`;
}
