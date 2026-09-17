import { CurrencyCode } from './currency-code';
import { DecimalPlaces } from './decimal-places';

export interface CurrencySettings {
  readonly currency: CurrencyCode;
  readonly currencySymbol: string;
  readonly decimalPlaces: DecimalPlaces;
}
