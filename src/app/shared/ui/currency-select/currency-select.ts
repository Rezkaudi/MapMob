import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CurrencyCode } from '../../money/currency-code';
import { CURRENCY_CODES } from '../../money/currency-codes';
import { CURRENCY_NAMES } from '../../money/currency-names';
import { CURRENCY_SYMBOLS } from '../../money/currency-symbols';
import { AppIcon } from '../app-icon/app-icon';
import { CurrencySelectVariant } from './currency-select-variant';

interface VariantSkin {
  readonly box: string;
  readonly symbol: string;
  readonly icon: string;
  readonly iconSize: number;
  readonly iconColor: string;
}

const VARIANT_SKINS: Record<CurrencySelectVariant, VariantSkin> = {
  chip: {
    box: 'h-7 gap-1 rounded bg-[#eceef0] px-2.5',
    symbol: 'text-[12px] font-bold text-text-primary',
    icon: 'chevron-down',
    iconSize: 14,
    iconColor: 'text-text-primary',
  },
  square: {
    box: 'h-8 rounded-[2px] bg-[#ECEEF0] px-1 py-0.5',
    symbol: 'text-center text-[12px]/[28px] font-medium text-text-primary',
    icon: 'chevron-down',
    iconSize: 18,
    iconColor: 'text-text-primary',
  },
  cap: {
    box: 'h-full gap-1 rounded-s-lg border-e border-border bg-surface-muted px-2',
    symbol: 'text-[12px]/[16px] font-bold text-text-primary',
    icon: 'chevron-down-thin',
    iconSize: 14,
    iconColor: 'text-[#94a3b8]',
  },
};

const OPTIONS = CURRENCY_CODES.map((code) => ({
  code,
  label: `${CURRENCY_SYMBOLS[code]} — ${CURRENCY_NAMES[code]}`,
}));

/** The badge beside a price field that picks the currency the amount is in. */
@Component({
  selector: 'app-currency-select',
  imports: [AppIcon],
  templateUrl: './currency-select.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrencySelect {
  readonly currency = input.required<CurrencyCode>();
  readonly variant = input<CurrencySelectVariant>('chip');
  readonly label = input<string>('العملة');
  readonly currencyChange = output<CurrencyCode>();

  protected readonly options = OPTIONS;
  protected readonly symbol = computed(() => CURRENCY_SYMBOLS[this.currency()]);
  protected readonly skin = computed(() => VARIANT_SKINS[this.variant()]);

  protected pick(event: Event): void {
    this.currencyChange.emit((event.target as HTMLSelectElement).value as CurrencyCode);
  }
}
