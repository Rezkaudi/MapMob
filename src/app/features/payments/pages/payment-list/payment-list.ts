import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { toCalendarDay } from '../../../../shared/formatting/calendar-day';
import { EmptyPageMessage } from '../../../../shared/ui/empty-page-message/empty-page-message';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { PaymentDetailStore } from '../../state/payment-detail.store';
import { PaymentsStore } from '../../state/payments.store';
import { PaymentDetailDialog } from '../../ui/payment-detail-dialog/payment-detail-dialog';
import { PaymentTable } from '../../ui/payment-table/payment-table';
import { PaymentToolbar } from '../../ui/payment-toolbar/payment-toolbar';

const NEW_PAYMENT_URL = '/payments/new';

@Component({
  selector: 'app-payment-list',
  imports: [
    EmptyPageMessage,
    ErrorState,
    PageHeader,
    PaymentDetailDialog,
    PaymentTable,
    PaymentToolbar,
    StatCard,
    TablePagination,
  ],
  templateUrl: './payment-list.html',
  providers: [PaymentDetailStore],
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentList {
  private readonly router = inject(Router);
  private readonly fileSaver = inject(FileSaver);
  private readonly clock = inject(CLOCK);

  protected readonly store = inject(PaymentsStore);
  protected readonly detailStore = inject(PaymentDetailStore);

  constructor() {
    this.store.loadPayments();
    this.store.loadSummary();
  }

  protected addPayment(): void {
    this.router.navigateByUrl(NEW_PAYMENT_URL);
  }

  protected async exportPayments(): Promise<void> {
    const file = await this.store.exportPayments();
    if (file) {
      this.fileSaver.save(file, `payments-${toCalendarDay(this.clock())}.csv`);
    }
  }
}
