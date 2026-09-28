import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { FilterToolbar } from '../../../../shared/ui/filter-toolbar/filter-toolbar';
import { MerchantOfferFilters } from '../../models/merchant-offer-filters';
import { MerchantOfferFilterPanel } from '../merchant-offer-filter-panel/merchant-offer-filter-panel';

/** The offers frame keeps sort and "الفلاتر" 8px apart. */
const CONTROL_GAP_PX = 8;

@Component({
  selector: 'app-merchant-offer-toolbar',
  imports: [FilterToolbar, MerchantOfferFilterPanel],
  templateUrl: './merchant-offer-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantOfferToolbar {
  readonly filters = input.required<MerchantOfferFilters>();
  readonly activeFilterCount = input<number>(0);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly filtersApply = output<MerchantOfferFilters>();

  protected readonly controlGap = CONTROL_GAP_PX;
}
