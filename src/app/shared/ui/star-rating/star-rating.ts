import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

const STAR_COUNT = 5;

/**
 * `pointed` is the user detail page's star; `rounded` is the smaller one the review drawer draws;
 * `amber` is the merchant reviews' yellow star on a pale grey.
 */
export type StarStyle = 'pointed' | 'rounded' | 'amber';

/** `rtl` fills from the right, as the merchant review cards draw it. */
export type StarFillDirection = 'ltr' | 'rtl';

const DEFAULT_GAP_PX = 4;

interface StarLook {
  readonly icon: string;
  readonly size: number;
  readonly filledClass: string;
  readonly emptyClass: string;
}

const STAR_LOOKS: Record<StarStyle, StarLook> = {
  pointed: {
    icon: 'star-filled',
    size: 15,
    filledClass: 'text-[#fea619]',
    emptyClass: 'text-border',
  },
  rounded: { icon: 'star-solid', size: 12, filledClass: 'text-accent', emptyClass: 'text-border' },
  amber: {
    icon: 'star-solid',
    size: 12,
    filledClass: 'text-[#fbbf24]',
    emptyClass: 'text-[#e2e8f0]',
  },
};

@Component({
  selector: 'app-star-rating',
  imports: [AppIcon],
  templateUrl: './star-rating.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarRating {
  /** Whole stars, 1 to 5. */
  readonly rating = input.required<number>();
  readonly starStyle = input<StarStyle>('pointed');
  /** `null` keeps the style's own size. */
  readonly size = input<number | null>(null);
  readonly gap = input<number>(DEFAULT_GAP_PX);
  readonly fillDirection = input<StarFillDirection>('ltr');

  protected readonly look = computed(() => STAR_LOOKS[this.starStyle()]);
  protected readonly starSize = computed(() => this.size() ?? this.look().size);
  protected readonly stars = computed(() =>
    Array.from({ length: STAR_COUNT }, (_, index) =>
      index < this.rating() ? this.look().filledClass : this.look().emptyClass,
    ),
  );
  protected readonly spokenRating = computed(() => `${this.rating()} من ${STAR_COUNT} نجوم`);
}
