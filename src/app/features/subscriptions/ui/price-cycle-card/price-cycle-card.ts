import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { CurrencyCode } from '../../../../shared/money/currency-code';
import { CurrencySelect } from '../../../../shared/ui/currency-select/currency-select';

/** The yearly card is green because it carries the discount; the monthly one is blue. */
export type PriceCycleTone = 'monthly' | 'yearly';

interface CycleSkin {
  readonly card: string;
  readonly dot: string;
  readonly badge: string;
}

let fieldCount = 0;

function nextFieldNumber(): number {
  fieldCount += 1;
  return fieldCount;
}

const CYCLE_SKINS: Record<PriceCycleTone, CycleSkin> = {
  monthly: {
    card: 'border-2 border-[#e0efff] bg-[#f0f7ff]/20',
    dot: 'bg-primary',
    badge: 'border border-[#e5e7eb] bg-white text-[#0472cd]',
  },
  yearly: {
    card: 'border-2 border-status-success/16 bg-[#ecfdf5]/20',
    dot: 'bg-status-success',
    badge: 'bg-status-success/16 text-status-success',
  },
};

/** One billing cycle in "التسعير ودورات الفوترة": its title, badge, price and currency. */
@Component({
  selector: 'app-price-cycle-card',
  imports: [CurrencySelect],
  templateUrl: './price-cycle-card.html',
  host: { class: 'block flex-1' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PriceCycleCard {
  readonly tone = input.required<PriceCycleTone>();
  readonly title = input.required<string>();
  readonly badge = input.required<string>();
  readonly priceLabel = input.required<string>();
  readonly currency = input.required<CurrencyCode>();
  readonly control = input.required<FormControl<number | null>>();
  readonly currencyChange = output<CurrencyCode>();

  protected readonly skin = computed(() => CYCLE_SKINS[this.tone()]);
  /** Both cards live on one page, so each needs its own id to tie caption to field. */
  protected readonly priceFieldId = `plan-price-${nextFieldNumber()}`;

  protected typePrice(event: Event): void {
    const typed = (event.target as HTMLInputElement).value;
    this.control().setValue(typed === '' ? null : Math.max(Number(typed), 0));
  }
}
