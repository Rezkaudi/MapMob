import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { FilterToolbar } from '../../../../shared/ui/filter-toolbar/filter-toolbar';
import { OwnerReviewFilters } from '../../models/owner-review-filters';
import { OwnerReviewFilterPanel } from '../owner-review-filter-panel/owner-review-filter-panel';

/** The rating frame keeps sort and "الفلاتر" 8px apart. */
const CONTROL_GAP_PX = 8;

@Component({
  selector: 'app-owner-review-toolbar',
  imports: [FilterToolbar, OwnerReviewFilterPanel],
  templateUrl: './owner-review-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OwnerReviewToolbar {
  readonly filters = input.required<OwnerReviewFilters>();
  readonly activeFilterCount = input<number>(0);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly filtersApply = output<OwnerReviewFilters>();

  protected readonly controlGap = CONTROL_GAP_PX;
}
