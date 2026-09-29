import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { StarRating } from '../../../../shared/ui/star-rating/star-rating';
import { RatingSummaryView } from '../../state/rating-summary-view';
import { StarDistribution } from '../star-distribution/star-distribution';

/** The 216px card over the table: the store's score, the star bars and the review policy. */
@Component({
  selector: 'app-rating-summary-card',
  imports: [AppIcon, Skeleton, StarDistribution, StarRating],
  templateUrl: './rating-summary-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RatingSummaryCard {
  /** `null` while the numbers load. */
  readonly view = input.required<RatingSummaryView | null>();
}
