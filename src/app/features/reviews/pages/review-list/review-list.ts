import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { toCalendarDay } from '../../../../shared/formatting/calendar-day';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { ExportButton } from '../../../../shared/ui/export-button/export-button';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { Review } from '../../models/review';
import { ReviewDetailStore } from '../../state/review-detail.store';
import { ReviewsStore } from '../../state/reviews.store';
import { buildReviewDeleteCopy } from '../../ui/review-dialog-copy';
import {
  ReviewDetailDrawer,
  ReviewStatusRequest,
} from '../../ui/review-detail-drawer/review-detail-drawer';
import { ReviewTable } from '../../ui/review-table/review-table';
import { ReviewToolbar } from '../../ui/review-toolbar/review-toolbar';

@Component({
  selector: 'app-review-list',
  imports: [
    ConfirmActionDialog,
    ErrorState,
    ExportButton,
    PageHeader,
    ReviewDetailDrawer,
    ReviewTable,
    ReviewToolbar,
    StatCard,
    TablePagination,
    Toast,
  ],
  templateUrl: './review-list.html',
  providers: [ReviewDetailStore],
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewList {
  private readonly fileSaver = inject(FileSaver);
  private readonly clock = inject(CLOCK);

  protected readonly store = inject(ReviewsStore);
  protected readonly detailStore = inject(ReviewDetailStore);
  /** View state only: the review waiting for the delete to be confirmed. */
  protected readonly pendingDeletion = signal<Review | null>(null);
  protected readonly deleteCopy = computed(() => {
    const review = this.pendingDeletion();
    return review ? buildReviewDeleteCopy(review) : null;
  });

  constructor() {
    this.store.loadReviews();
    this.store.loadSummary();
  }

  protected acceptReport(review: Review): void {
    this.closeDrawerWhenSaved(this.store.acceptReport(review.id));
  }

  protected rejectReport(review: Review): void {
    this.closeDrawerWhenSaved(this.store.rejectReport(review.id));
  }

  protected changeStatus({ review, status }: ReviewStatusRequest): void {
    this.closeDrawerWhenSaved(this.store.setReviewStatus(review.id, status));
  }

  protected async confirmDeletion(): Promise<void> {
    const review = this.pendingDeletion();
    if (!review) {
      return;
    }
    if (await this.store.deleteReview(review.id)) {
      this.pendingDeletion.set(null);
      this.detailStore.close();
    }
  }

  protected cancelDeletion(): void {
    this.pendingDeletion.set(null);
    this.store.clearSaveError();
  }

  protected async exportReviews(): Promise<void> {
    const file = await this.store.exportReviews();
    if (file) {
      this.fileSaver.save(file, `reviews-${toCalendarDay(this.clock())}.csv`);
    }
  }

  private async closeDrawerWhenSaved(save: Promise<boolean>): Promise<void> {
    if (await save) {
      this.detailStore.close();
    }
  }
}
