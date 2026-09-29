import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { ReviewReport } from '../../models/review-report';
import { MerchantReviewsStore } from '../../state/merchant-reviews.store';
import { OwnerReviewTable } from '../../ui/owner-review-table/owner-review-table';
import { OwnerReviewToolbar } from '../../ui/owner-review-toolbar/owner-review-toolbar';
import { RatingSummaryCard } from '../../ui/rating-summary-card/rating-summary-card';
import { ReviewDetailsDialog } from '../../ui/review-details-dialog/review-details-dialog';
import { ReviewReportDialog } from '../../ui/review-report-dialog/review-report-dialog';

@Component({
  selector: 'app-merchant-reviews-page',
  imports: [
    ErrorState,
    OwnerReviewTable,
    OwnerReviewToolbar,
    PageHeader,
    RatingSummaryCard,
    ReviewDetailsDialog,
    ReviewReportDialog,
    TablePagination,
    Toast,
  ],
  providers: [MerchantReviewsStore],
  templateUrl: './merchant-reviews-page.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantReviewsPage {
  protected readonly store = inject(MerchantReviewsStore);

  constructor() {
    this.store.load();
  }

  protected sendReport(report: ReviewReport): void {
    this.store.submitReport(report);
  }
}
