import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

const STAR_COUNT = 5;

@Component({
  selector: 'app-star-rating',
  imports: [AppIcon],
  templateUrl: './star-rating.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRating {
  /** Whole stars, 1 to 5. */
  readonly rating = input.required<number>();

  protected readonly stars = computed(() =>
    Array.from({ length: STAR_COUNT }, (_, index) => index < this.rating()),
  );
  protected readonly spokenRating = computed(() => `${this.rating()} من ${STAR_COUNT} نجوم`);
}
