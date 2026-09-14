import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReviewRow } from '../../state/user-detail-view';
import { StarRating } from '../star-rating/star-rating';

@Component({
  selector: 'app-user-review-list',
  imports: [StarRating],
  templateUrl: './user-review-list.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserReviewList {
  readonly rows = input.required<readonly ReviewRow[]>();
}
