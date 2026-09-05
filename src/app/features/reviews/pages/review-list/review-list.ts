import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { Badge, BadgeTone } from '../../../../shared/ui/badge/badge';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { TableToolbar } from '../../../../shared/ui/table-toolbar/table-toolbar';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { REVIEW_STATUS_LABEL, ReviewStatus } from '../../models/review-status';
import { ReviewsStore } from '../../state/reviews.store';

/** Tick box, six data columns and the action column. */
const TABLE_COLUMN_COUNT = 8;

const STATUS_TONE: Record<ReviewStatus, BadgeTone> = {
  published: 'success',
  reported: 'error',
  hidden: 'neutral',
};

@Component({
  selector: 'app-review-list',
  imports: [
    AppIcon,
    ActionMenu,
    Badge,
    ErrorState,
    TableEmpty,
    TableSkeleton,
    StatCard,
    TablePagination,
    TableToolbar,
    ArabicDatePipe,
    DecimalPipe,
  ],
  templateUrl: './review-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewList {
  protected readonly tableColumnCount = TABLE_COLUMN_COUNT;
  protected readonly store = inject(ReviewsStore);
  protected readonly statusLabel = REVIEW_STATUS_LABEL;
  protected readonly statusTone = STATUS_TONE;

  constructor() {
    this.store.loadReviews();
  }

  protected onSearch(search: string): void {
    this.store.setSearch(search);
  }

  protected onPageChange(pageIndex: number): void {
    this.store.changePage(pageIndex);
  }
}
