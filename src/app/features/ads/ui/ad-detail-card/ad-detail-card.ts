import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

/** The metrics card sets its rows 16px under the rule; the other two 20px. */
export type AdDetailCardSpacing = 'regular' | 'tight';

const SPACING_CLASSES: Record<AdDetailCardSpacing, string> = {
  regular: 'gap-5',
  tight: 'gap-4',
};

/** The white card the three detail sections share: a ruled heading, then their rows. */
@Component({
  selector: 'app-ad-detail-card',
  templateUrl: './ad-detail-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdDetailCard {
  readonly heading = input.required<string>();
  readonly spacing = input<AdDetailCardSpacing>('regular');

  protected readonly spacingClasses = computed(() => SPACING_CLASSES[this.spacing()]);
}
