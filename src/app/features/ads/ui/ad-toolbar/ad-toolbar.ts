import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { FilterToolbar } from '../../../../shared/ui/filter-toolbar/filter-toolbar';
import { AdFilters } from '../../models/ad-filters';
import { AdFilterPanel } from '../ad-filter-panel/ad-filter-panel';

/** The ads design keeps sort and "الفلاتر" 8px apart. */
const CONTROL_GAP_PX = 8;

@Component({
  selector: 'app-ad-toolbar',
  imports: [AdFilterPanel, FilterToolbar],
  templateUrl: './ad-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdToolbar {
  readonly filters = input.required<AdFilters>();
  readonly activeFilterCount = input<number>(0);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly filtersApply = output<AdFilters>();

  protected readonly controlGap = CONTROL_GAP_PX;
}
