import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { StarRating } from '../../../../shared/ui/star-rating/star-rating';
import { MerchantReviewItem } from '../../models/merchant-review-item';
import { OverviewCardHeading } from '../overview-card-heading/overview-card-heading';

const REVIEWS_ROUTE = '/merchant/reviews';
const PLACEHOLDER_ROWS = [1, 2];

@Component({
  selector: 'app-latest-reviews-card',
  imports: [OverviewCardHeading, Skeleton, StarRating],
  templateUrl: './latest-reviews-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LatestReviewsCard {
  readonly reviews = input.required<readonly MerchantReviewItem[]>();
  readonly isLoading = input<boolean>(false);

  protected readonly reviewsRoute = REVIEWS_ROUTE;
  protected readonly placeholderRows = PLACEHOLDER_ROWS;
}
