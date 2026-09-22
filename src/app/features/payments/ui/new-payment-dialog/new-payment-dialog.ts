import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { formatGroupedNumber } from '../../../../shared/formatting/grouped-number';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { DialogFrame } from '../../../../shared/ui/dialog-frame/dialog-frame';
import { SegmentedChoice } from '../../../../shared/ui/segmented-choice/segmented-choice';
import { SlashDatePipe } from '../../../../shared/pipes/slash-date.pipe';
import { PAYMENT_CURRENCY_SYMBOLS } from '../../models/payment-currency';
import { PAYMENT_KIND_CHOICES, PaymentKind } from '../../models/payment-kind';
import { PAYMENT_TERM_CHOICES, PaymentTerm } from '../../models/payment-term';
import { NewPaymentStore } from '../../state/new-payment.store';
import { CurrentSubscriptionCard } from '../current-subscription-card/current-subscription-card';

/** The design records cash only, so the method row is a fixed note rather than a choice. */
const CASH_LABEL = 'نقدي';

@Component({
  selector: 'app-new-payment-dialog',
  imports: [AppIcon, CurrentSubscriptionCard, DialogFrame, SegmentedChoice, SlashDatePipe],
  templateUrl: './new-payment-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NewPaymentDialog {
  protected readonly store = inject(NewPaymentStore);
  protected readonly kindChoices = PAYMENT_KIND_CHOICES;
  protected readonly termChoices = PAYMENT_TERM_CHOICES;
  protected readonly currencySymbols = PAYMENT_CURRENCY_SYMBOLS;
  protected readonly cashLabel = CASH_LABEL;
  protected readonly groupedAmount = computed(() => formatGroupedNumber(this.store.amount()));

  protected onKindChange(value: string | null): void {
    this.store.setKind((value ?? 'new') as PaymentKind);
  }

  protected onTermChange(value: string | null): void {
    this.store.setTerm((value ?? 'monthly') as PaymentTerm);
  }

  protected onMerchantChange(event: Event): void {
    this.store.setMerchantId((event.target as HTMLSelectElement).value);
  }

  protected onPlanChange(event: Event): void {
    this.store.setPlanId((event.target as HTMLSelectElement).value);
  }

  /** The box shows "300,000", so the commas come back out before the number is read. */
  protected onAmountInput(event: Event): void {
    this.store.setAmount(Number((event.target as HTMLInputElement).value.replace(/,/g, '')) || 0);
  }

  protected onPaidAtInput(event: Event): void {
    this.store.setPaidAt((event.target as HTMLInputElement).value);
  }

  protected onNotesInput(event: Event): void {
    this.store.setNotes((event.target as HTMLTextAreaElement).value);
  }
}
