import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
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
import { Complaint } from '../../models/complaint';
import { ComplaintsStore, NO_COMPLAINTS_MESSAGE } from '../../state/complaints.store';
import { buildComplaintDeleteCopy } from '../../ui/complaint-dialog-copy';
import { ComplaintTable } from '../../ui/complaint-table/complaint-table';
import { ComplaintToolbar } from '../../ui/complaint-toolbar/complaint-toolbar';

const COMPLAINTS_URL = '/complaints';

@Component({
  selector: 'app-complaint-list',
  imports: [
    ComplaintTable,
    ComplaintToolbar,
    ConfirmActionDialog,
    EmptyPageMessage,
    ErrorState,
    PageHeader,
    StatCard,
    TablePagination,
    Toast,
  ],
  templateUrl: './complaint-list.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintList {
  private readonly router = inject(Router);
  private readonly fileSaver = inject(FileSaver);
  private readonly clock = inject(CLOCK);

  protected readonly store = inject(ComplaintsStore);
  protected readonly noComplaintsMessage = NO_COMPLAINTS_MESSAGE;
  /** View state only: the complaint waiting for the delete to be confirmed. */
  protected readonly pendingDeletion = signal<Complaint | null>(null);
  protected readonly deleteCopy = computed(() => {
    const complaint = this.pendingDeletion();
    return complaint ? buildComplaintDeleteCopy(complaint) : null;
  });

  constructor() {
    this.store.loadComplaints();
    this.store.loadSummary();
  }

  protected openComplaint(complaint: Complaint): void {
    this.router.navigateByUrl(`${COMPLAINTS_URL}/${complaint.id}`);
  }

  protected async exportComplaints(): Promise<void> {
    const file = await this.store.exportComplaints();
    if (file) {
      this.fileSaver.save(file, `complaints-${toCalendarDay(this.clock())}.csv`);
    }
  }

  protected async confirmDeletion(): Promise<void> {
    const complaint = this.pendingDeletion();
    if (complaint && (await this.store.deleteComplaint(complaint.id))) {
      this.pendingDeletion.set(null);
    }
  }

  protected cancelDeletion(): void {
    this.pendingDeletion.set(null);
    this.store.clearSaveError();
  }
}
