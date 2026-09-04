import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LucideStar } from '@lucide/angular';

const STAR_COUNT = 5;

@Component({
  selector: 'app-star-rating',
  imports: [LucideStar],
  templateUrl: './star-rating.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRating {
  readonly value = input.required<number>();

  protected readonly stars = computed(() => {
    const filledCount = Math.round(this.value());
    return Array.from({ length: STAR_COUNT }, (_, index) => index < filledCount);
  });
}
