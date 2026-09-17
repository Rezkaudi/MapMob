import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { FilterToolbar } from '../../../../shared/ui/filter-toolbar/filter-toolbar';
import { ComplaintFilters } from '../../models/complaint-filters';
import { ComplaintFilterPanel } from '../complaint-filter-panel/complaint-filter-panel';

/** The complaints design keeps sort and "الفلاتر" 8px apart. */
const CONTROL_GAP_PX = 8;

@Component({
  selector: 'app-complaint-toolbar',
  imports: [ComplaintFilterPanel, FilterToolbar],
  templateUrl: './complaint-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintToolbar {
  readonly filters = input.required<ComplaintFilters>();
  readonly activeFilterCount = input<number>(0);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly filtersApply = output<ComplaintFilters>();

  protected readonly controlGap = CONTROL_GAP_PX;
}
