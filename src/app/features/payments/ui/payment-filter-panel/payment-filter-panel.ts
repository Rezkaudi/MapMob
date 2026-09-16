import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
} from '@angular/core';
import { isDateRangeValid } from '../../../../shared/formatting/date-range-summary';
import { DateRange } from '../../../../shared/models/date-range';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ChoiceChips } from '../../../../shared/ui/choice-chips/choice-chips';
import { DateRangeFields } from '../../../../shared/ui/date-range-fields/date-range-fields';
import { FilterPopover } from '../../../../shared/ui/filter-popover/filter-popover';
import { PAYMENT_CURRENCY_CHOICES } from '../../models/payment-currency-choices';
import { NO_PAYMENT_FILTERS, PaymentFilters } from '../../models/payment-filters';
import { PAYMENT_METHOD_CHOICES } from '../../models/payment-method-choices';
import { PaymentCurrency } from '../../models/payment-currency';
import { PaymentMethod } from '../../models/payment-method';

/** The 384px popover under "الفلاتر" on the payments page — the compact-filter-popover-card frame. */
@Component({
  selector: 'app-payment-filter-panel',
  imports: [AppIcon, ChoiceChips, DateRangeFields, FilterPopover],
  templateUrl: './payment-filter-panel.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentFilterPanel {
  readonly filters = input.required<PaymentFilters>();
  readonly applied = output<PaymentFilters>();
  readonly closed = output<void>();

  protected readonly methodOptions = PAYMENT_METHOD_CHOICES;
  protected readonly currencyOptions = PAYMENT_CURRENCY_CHOICES;
  protected readonly draft = linkedSignal(() => this.filters());
  protected readonly canApply = computed(() => {
    const { from, to } = this.draft().paidOn;
    return !from || !to || isDateRangeValid({ from, to });
  });

  protected changeCompanyName(companyName: string): void {
    this.draft.update((draft) => ({ ...draft, companyName }));
  }

  protected clearCompanyName(): void {
    this.changeCompanyName('');
  }

  protected pickMethod(paymentMethod: string | null): void {
    this.draft.update((draft) => ({ ...draft, paymentMethod: paymentMethod as PaymentMethod | null }));
  }

  protected pickCurrency(currency: string | null): void {
    this.draft.update((draft) => ({ ...draft, currency: currency as PaymentCurrency | null }));
  }

  protected changePaidOn(paidOn: DateRange): void {
    this.draft.update((draft) => ({ ...draft, paidOn }));
  }

  protected apply(): void {
    if (this.canApply()) {
      this.applied.emit(this.draft());
    }
  }

  protected reset(): void {
    this.draft.set(NO_PAYMENT_FILTERS);
    this.applied.emit(NO_PAYMENT_FILTERS);
  }
}
