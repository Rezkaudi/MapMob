import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyCode } from '../money/currency-code';
import { CURRENCY_SYMBOLS } from '../money/currency-symbols';

@Pipe({ name: 'currencySign' })
export class CurrencySymbolPipe implements PipeTransform {
  transform(currency: CurrencyCode): string {
    return CURRENCY_SYMBOLS[currency];
  }
}
