import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StarRating } from '../../../../shared/ui/star-rating/star-rating';
import { Review } from '../../models/review';

@Component({
  selector: 'app-review-content',
  imports: [StarRating],
  templateUrl: './review-content.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewContent {
  readonly review = input.required<Review>();
  readonly ratingLabel = input<string | null>(null);
  readonly submittedLabel = input.required<string>();
}
