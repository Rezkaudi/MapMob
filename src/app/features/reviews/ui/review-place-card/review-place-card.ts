import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReviewedPlace } from '../../models/reviewed-place';

@Component({
  selector: 'app-review-place-card',
  templateUrl: './review-place-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewPlaceCard {
  readonly place = input.required<ReviewedPlace>();
  readonly referenceLabel = input.required<string>();
  readonly metaLabel = input.required<string>();
}
