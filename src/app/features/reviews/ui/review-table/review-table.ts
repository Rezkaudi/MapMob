import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { Review } from '../../models/review';
import { formatReviewRating } from '../../state/review-rating-label';
import { ReviewStatusPill } from '../review-status-pill/review-status-pill';

/**
 * Column widths as shares of the 1046px design table (80 / 134 / 142 / 148 / 168 / 136 / 130 / 108px),
 * picked so each header sits over the values the design centres under it.
 */
const COLUMN_WIDTHS = ['7.65%', '12.81%', '13.58%', '14.15%', '16.06%', '13%', '12.43%', '10.32%'];
const DEFAULT_ROW_COUNT = 4;
const MISSING_RATING_LABEL = '—';

interface ReviewTableRow {
  readonly review: Review;
  readonly ratingLabel: string;
}

@Component({
  selector: 'app-review-table',
  imports: [ArabicDatePipe, ReviewStatusPill, RowActionsMenu, TableEmpty, TableSkeleton],
  templateUrl: './review-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewTable {
  readonly entries = input.required<readonly Review[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly view = output<Review>();
  readonly remove = output<Review>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
  protected readonly rows = computed<readonly ReviewTableRow[]>(() =>
    this.entries().map((review) => ({
      review,
      ratingLabel: formatReviewRating(review.rating) ?? MISSING_RATING_LABEL,
    })),
  );
}
