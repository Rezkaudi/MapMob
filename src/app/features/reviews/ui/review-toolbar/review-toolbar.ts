import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { FilterToolbar } from '../../../../shared/ui/filter-toolbar/filter-toolbar';
import { ReviewFilters } from '../../models/review-filters';
import { ReviewFilterPanel } from '../review-filter-panel/review-filter-panel';

/** The reviews design keeps sort and "الفلاتر" 8px apart. */
const CONTROL_GAP_PX = 8;

@Component({
  selector: 'app-review-toolbar',
  imports: [FilterToolbar, ReviewFilterPanel],
  templateUrl: './review-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewToolbar {
  readonly filters = input.required<ReviewFilters>();
  readonly activeFilterCount = input<number>(0);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly filtersApply = output<ReviewFilters>();

  protected readonly controlGap = CONTROL_GAP_PX;
}
