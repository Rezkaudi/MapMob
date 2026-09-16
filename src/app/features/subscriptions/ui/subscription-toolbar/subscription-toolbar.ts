import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { FilterToolbar } from '../../../../shared/ui/filter-toolbar/filter-toolbar';
import { SubscriptionFilters } from '../../models/subscription-filters';
import { SubscriptionFilterPanel } from '../subscription-filter-panel/subscription-filter-panel';

/** The subscriptions design keeps sort and "الفلاتر" 8px apart. */
const CONTROL_GAP_PX = 8;

@Component({
  selector: 'app-subscription-toolbar',
  imports: [FilterToolbar, SubscriptionFilterPanel],
  templateUrl: './subscription-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionToolbar {
  readonly filters = input.required<SubscriptionFilters>();
  readonly activeFilterCount = input<number>(0);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly filtersApply = output<SubscriptionFilters>();

  protected readonly controlGap = CONTROL_GAP_PX;
}
