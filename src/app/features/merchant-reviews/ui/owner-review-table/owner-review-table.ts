import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { OwnerReview } from '../../models/owner-review';
import { formatReviewRating } from '../../../../shared/formatting/review-rating-label';
import { ReportStatusPill } from '../report-status-pill/report-status-pill';
import { ReviewRowMenu } from '../review-row-menu/review-row-menu';

/**
 * Column widths as shares of the 1046px design table (64 / 182 / 94 / 354 / 88 / 200 / 64px),
 * picked so each header sits over the values the design lines up under it.
 */
const COLUMN_WIDTHS = ['6.12%', '17.4%', '8.99%', '33.84%', '8.41%', '19.12%', '6.12%'];
const DEFAULT_ROW_COUNT = 4;
const MISSING_RATING_LABEL = '—';

interface OwnerReviewRow {
  readonly review: OwnerReview;
  readonly ratingLabel: string;
  readonly canReport: boolean;
}

@Component({
  selector: 'app-owner-review-table',
  imports: [ArabicDatePipe, ReportStatusPill, ReviewRowMenu, TableEmpty, TableSkeleton],
  templateUrl: './owner-review-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerReviewTable {
  readonly entries = input.required<readonly OwnerReview[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly view = output<OwnerReview>();
  readonly report = output<OwnerReview>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
  protected readonly rows = computed<readonly OwnerReviewRow[]>(() =>
    this.entries().map((review) => ({
      review,
      ratingLabel: formatReviewRating(review.rating) ?? MISSING_RATING_LABEL,
      canReport: review.reportStatus === 'none',
    })),
  );
}
