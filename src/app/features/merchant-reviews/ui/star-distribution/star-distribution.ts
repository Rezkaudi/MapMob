import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { formatArabicCount } from '../../../../shared/formatting/arabic-count';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ShareBar } from '../../../../shared/ui/share-bar/share-bar';
import { StarShareRow } from '../../state/rating-summary-view';
import { STAR_WORDS } from '../../state/review-count-words';

/** "توزيع النجوم": a slim yellow bar for each of 5 to 1 stars. */
@Component({
  selector: 'app-star-distribution',
  imports: [AppIcon, ShareBar],
  templateUrl: './star-distribution.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StarDistribution {
  readonly rows = input.required<readonly StarShareRow[]>();

  protected readonly labelledRows = computed(() =>
    this.rows().map((row) => ({ ...row, barLabel: formatArabicCount(row.stars, STAR_WORDS) })),
  );
}
