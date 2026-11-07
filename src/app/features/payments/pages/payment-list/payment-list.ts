import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { toCalendarDay } from '../../../../shared/formatting/calendar-day';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { EmptyPageMessage } from '../../../../shared/ui/empty-page-message/empty-page-message';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { Payment } from '../../models/payment';
import { EditPaymentStore } from '../../state/edit-payment.store';
import { NewPaymentStore } from '../../state/new-payment.store';
import { PaymentDetailStore } from '../../state/payment-detail.store';
import { PaymentsStore } from '../../state/payments.store';
import { EditPaymentDialog } from '../../ui/edit-payment-dialog/edit-payment-dialog';
import { NewPaymentDialog } from '../../ui/new-payment-dialog/new-payment-dialog';
import { PaymentDetailDialog } from '../../ui/payment-detail-dialog/payment-detail-dialog';
import { PaymentTable } from '../../ui/payment-table/payment-table';
import { PaymentToolbar } from '../../ui/payment-toolbar/payment-toolbar';
import { buildPaymentDeleteCopy } from '../../ui/payment-delete-copy';

@Component({
  selector: 'app-payment-list',
  imports: [
    ConfirmActionDialog,
    EditPaymentDialog,
    EmptyPageMessage,
    ErrorState,
    NewPaymentDialog,
    PageHeader,
    PaymentDetailDialog,
    PaymentTable,
    PaymentToolbar,
    StatCard,
    TablePagination,
    Toast,
  ],
  templateUrl: './payment-list.html',
  providers: [NewPaymentStore, EditPaymentStore, PaymentDetailStore],
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentList {
  private readonly fileSaver = inject(FileSaver);
  private readonly clock = inject(CLOCK);

  protected readonly store = inject(PaymentsStore);
  protected readonly detailStore = inject(PaymentDetailStore);
  protected readonly newPayment = inject(NewPaymentStore);
  protected readonly editPayment = inject(EditPaymentStore);

  /** View state only: the payment waiting for the delete to be confirmed. */
  protected readonly pendingDeletion = signal<Payment | null>(null);
  protected readonly deleteCopy = computed(() => {
    const payment = this.pendingDeletion();
    return payment ? buildPaymentDeleteCopy(payment) : null;
  });

  constructor() {
    this.store.reloadAll();
    this.reloadWhenDialogSaves(this.newPayment);
    this.reloadWhenDialogSaves(this.editPayment);
  }

  protected addPayment(): void {
    void this.newPayment.open();
  }

  protected async confirmDeletion(): Promise<void> {
    const payment = this.pendingDeletion();
    if (payment && (await this.store.deletePayment(payment.id))) {
      this.pendingDeletion.set(null);
    }
  }

  protected cancelDeletion(): void {
    this.pendingDeletion.set(null);
    this.store.clearSaveError();
  }

  /** A saved dialog closes itself, and the table and the totals have to catch up. */
  private reloadWhenDialogSaves(dialog: {
    readonly isOpen: Signal<boolean>;
    readonly saveError: Signal<string | null>;
  }): void {
    let wasOpen = false;
    effect(() => {
      const isOpen = dialog.isOpen();
      if (wasOpen && !isOpen && !dialog.saveError()) {
        this.store.reloadAll();
      }
      wasOpen = isOpen;
    });
  }

  protected async exportPayments(): Promise<void> {
    const file = await this.store.exportPayments();
    if (file) {
      this.fileSaver.save(file, `payments-${toCalendarDay(this.clock())}.csv`);
    }
  }
}
