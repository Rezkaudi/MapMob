import { ChangeDetectionStrategy, Component, HostListener, input, output } from '@angular/core';
import { SlashDatePipe } from '../../../../shared/pipes/slash-date.pipe';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { PAYMENT_CURRENCY_FULL_NAMES } from '../../models/payment-currency';
import { PAYMENT_METHOD_LABELS } from '../../models/payment-method';
import { PaymentDetail } from '../../models/payment-detail';

/** The centered modal the "detail-payments" frame draws on top of the list, shaped like plan-form-dialog. */
@Component({
  selector: 'app-payment-detail-dialog',
  imports: [AppIcon, ErrorState, Skeleton, SlashDatePipe],
  templateUrl: './payment-detail-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentDetailDialog {
  readonly detail = input.required<PaymentDetail | null>();
  readonly isLoading = input<boolean>(false);
  readonly error = input<string | null>(null);

  readonly closed = output<void>();
  readonly retry = output<void>();

  protected readonly methodLabels = PAYMENT_METHOD_LABELS;
  protected readonly currencyFullNames = PAYMENT_CURRENCY_FULL_NAMES;

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }
}
