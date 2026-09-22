import { ChangeDetectionStrategy, Component, effect, inject } from '@angular/core';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { toCalendarDay } from '../../../../shared/formatting/calendar-day';
import { EmptyPageMessage } from '../../../../shared/ui/empty-page-message/empty-page-message';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { NewPaymentStore } from '../../state/new-payment.store';
import { PaymentDetailStore } from '../../state/payment-detail.store';
import { PaymentsStore } from '../../state/payments.store';
import { NewPaymentDialog } from '../../ui/new-payment-dialog/new-payment-dialog';
import { PaymentDetailDialog } from '../../ui/payment-detail-dialog/payment-detail-dialog';
import { PaymentTable } from '../../ui/payment-table/payment-table';
import { PaymentToolbar } from '../../ui/payment-toolbar/payment-toolbar';

@Component({
  selector: 'app-payment-list',
  imports: [
    EmptyPageMessage,
    ErrorState,
    NewPaymentDialog,
    PageHeader,
    PaymentDetailDialog,
    PaymentTable,
    PaymentToolbar,
    StatCard,
    TablePagination,
  ],
  templateUrl: './payment-list.html',
  providers: [NewPaymentStore, PaymentDetailStore],
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentList {
  private readonly fileSaver = inject(FileSaver);
  private readonly clock = inject(CLOCK);

  protected readonly store = inject(PaymentsStore);
  protected readonly detailStore = inject(PaymentDetailStore);
  protected readonly newPayment = inject(NewPaymentStore);

  constructor() {
    this.store.loadPayments();
    this.store.loadSummary();
    this.reloadWhenPaymentRecorded();
  }

  protected addPayment(): void {
    void this.newPayment.open();
  }

  /** A recorded payment closes the dialog, and the table and the totals have to catch up. */
  private reloadWhenPaymentRecorded(): void {
    let wasOpen = false;
    effect(() => {
      const isOpen = this.newPayment.isOpen();
      if (wasOpen && !isOpen && !this.newPayment.saveError()) {
        this.store.loadPayments();
        this.store.loadSummary();
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
