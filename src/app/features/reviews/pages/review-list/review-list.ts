import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DecimalPipe, DatePipe } from '@angular/common';
import { LucideDownload, LucideMoreVertical, LucideStar } from '@lucide/angular';
import { Badge } from '../../../../shared/ui/badge/badge';
import { BadgeTone } from '../../../../shared/ui/badge/badge';
import { Button } from '../../../../shared/ui/button/button';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { StarRating } from '../../../../shared/ui/star-rating/star-rating';
import { SearchInput } from '../../../../shared/ui/search-input/search-input';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { ReviewsStore } from '../../state/reviews.store';
import { ReviewStatus, REVIEW_STATUS_LABEL } from '../../models/review-status';

const STATUS_TONE: Record<ReviewStatus, BadgeTone> = {
  published: 'success',
  reported: 'error',
  hidden: 'neutral',
};

@Component({
  selector: 'app-review-list',
  imports: [
    Badge,
    Button,
    StatCard,
    StarRating,
    SearchInput,
    TablePagination,
    DecimalPipe,
    DatePipe,
    LucideDownload,
    LucideMoreVertical,
  ],
  templateUrl: './review-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewList {
  protected readonly store = inject(ReviewsStore);
  protected readonly starIcon = LucideStar;
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
