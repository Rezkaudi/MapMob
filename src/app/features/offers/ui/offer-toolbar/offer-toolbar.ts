import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { FilterToolbar } from '../../../../shared/ui/filter-toolbar/filter-toolbar';
import { OfferFilters } from '../../models/offer-filters';
import { OfferFilterPanel } from '../offer-filter-panel/offer-filter-panel';

/** The offers design keeps sort and "الفلاتر" 8px apart. */
const CONTROL_GAP_PX = 8;

@Component({
  selector: 'app-offer-toolbar',
  imports: [FilterToolbar, OfferFilterPanel],
  templateUrl: './offer-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferToolbar {
  readonly filters = input.required<OfferFilters>();
  readonly activeFilterCount = input<number>(0);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly filtersApply = output<OfferFilters>();

  protected readonly controlGap = CONTROL_GAP_PX;
}
