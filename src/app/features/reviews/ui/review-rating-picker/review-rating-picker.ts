import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { REVIEW_RATING_FILTER_LABEL, ReviewRatingFilter } from '../../models/review-rating-filter';

const ALL_LABEL = 'الكل';
const PICKED_CHOICE = 'rounded-lg border-primary bg-primary text-white';
const IDLE_CHOICE = 'rounded border-border text-text-secondary hover:border-primary/40';
const UNSTARRED_FILTERS: ReadonlySet<ReviewRatingFilter | null> = new Set([null, 'unrated']);

interface RatingChoice {
  readonly value: ReviewRatingFilter | null;
  readonly label: string;
  readonly hasStar: boolean;
  readonly isPicked: boolean;
  readonly classes: string;
}

const CHOICE_VALUES: readonly (ReviewRatingFilter | null)[] = [
  null,
  ...(Object.keys(REVIEW_RATING_FILTER_LABEL) as ReviewRatingFilter[]),
];

/** The three-column star grid of the reviews filter panel. */
@Component({
  selector: 'app-review-rating-picker',
  imports: [AppIcon],
  templateUrl: './review-rating-picker.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewRatingPicker {
  readonly selected = input<ReviewRatingFilter | null>(null);
  readonly selectedChange = output<ReviewRatingFilter | null>();

  protected readonly choices = computed<readonly RatingChoice[]>(() =>
    CHOICE_VALUES.map((value) => {
      const isPicked = value === this.selected();
      return {
        value,
        label: value ? REVIEW_RATING_FILTER_LABEL[value] : ALL_LABEL,
        hasStar: !UNSTARRED_FILTERS.has(value),
        isPicked,
        classes: isPicked ? PICKED_CHOICE : IDLE_CHOICE,
      };
    }),
  );
}
