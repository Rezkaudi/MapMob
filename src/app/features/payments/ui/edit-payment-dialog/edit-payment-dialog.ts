import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import {
  formatGroupedNumber,
  parseGroupedNumber,
} from '../../../../shared/formatting/grouped-number';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { BusyLabel } from '../../../../shared/ui/busy-label/busy-label';
import { CurrencySelect } from '../../../../shared/ui/currency-select/currency-select';
import { DialogFrame } from '../../../../shared/ui/dialog-frame/dialog-frame';
import { PaymentCurrency } from '../../models/payment-currency';
import { EditPaymentStore } from '../../state/edit-payment.store';

@Component({
  selector: 'app-edit-payment-dialog',
  imports: [AppIcon, BusyLabel, CurrencySelect, DialogFrame],
  templateUrl: './edit-payment-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditPaymentDialog {
  protected readonly store = inject(EditPaymentStore);
  protected readonly groupedAmount = computed(() => formatGroupedNumber(this.store.amount()));

  protected onAmountInput(event: Event): void {
    this.store.setAmount(parseGroupedNumber((event.target as HTMLInputElement).value));
  }

  protected onCurrencyChange(currency: PaymentCurrency): void {
    this.store.setCurrency(currency);
  }

  protected onPaidAtInput(event: Event): void {
    this.store.setPaidAt((event.target as HTMLInputElement).value);
  }

  protected onNotesInput(event: Event): void {
    this.store.setNotes((event.target as HTMLTextAreaElement).value);
  }
}
