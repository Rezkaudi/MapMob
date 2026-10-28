import { toCurrencyCode } from '../../../shared/money/to-currency-code';
import { WonPrize } from '../models/won-prize';
import { LivePrize } from './live-prize';

/** The server keeps no sponsor, so a voucher comes back without one. */
export function toWonPrize(prize: LivePrize): WonPrize {
  return {
    kind: prize.type,
    value: { amount: Number(prize.value), currency: toCurrencyCode(prize.currency_code) },
    sponsorName: null,
  };
}
