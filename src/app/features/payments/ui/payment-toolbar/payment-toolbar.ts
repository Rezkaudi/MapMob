import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { FilterToolbar } from '../../../../shared/ui/filter-toolbar/filter-toolbar';
import { PaymentFilters } from '../../models/payment-filters';
import { PaymentFilterPanel } from '../payment-filter-panel/payment-filter-panel';

/** The payments design keeps sort and "الفلاتر" 8px apart. */
const CONTROL_GAP_PX = 8;

@Component({
  selector: 'app-payment-toolbar',
  imports: [FilterToolbar, PaymentFilterPanel],
  templateUrl: './payment-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentToolbar {
  readonly filters = input.required<PaymentFilters>();
  readonly activeFilterCount = input<number>(0);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly filtersApply = output<PaymentFilters>();

  protected readonly controlGap = CONTROL_GAP_PX;
}
