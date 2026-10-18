import { CURRENCY_CODES } from '../../../shared/money/currency-codes';
import { CURRENCY_NAMES } from '../../../shared/money/currency-names';
import { CURRENCY_SYMBOLS } from '../../../shared/money/currency-symbols';
import { SelectOption } from '../../../shared/ui/select-field/select-option';
import { GAME_TIME_ZONES } from './game-time-zone';

export const PRIZE_KIND_OPTIONS: readonly SelectOption[] = [
  { value: 'cash', label: 'جائزة مالية نقدية' },
  { value: 'voucher', label: 'قسيمة شرائية' },
];

/** "ليرة سورية (ل.س)", as the prize card writes it. */
export const CURRENCY_OPTIONS: readonly SelectOption[] = CURRENCY_CODES.map((code) => ({
  value: code,
  label: `${CURRENCY_NAMES[code]} (${CURRENCY_SYMBOLS[code]})`,
}));

export const TIME_ZONE_OPTIONS: readonly SelectOption[] = GAME_TIME_ZONES.map((zone) => ({
  value: zone.id,
  label: zone.label,
}));
