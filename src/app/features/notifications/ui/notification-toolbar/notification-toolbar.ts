import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { FilterToolbar } from '../../../../shared/ui/filter-toolbar/filter-toolbar';
import { NotificationFilters } from '../../models/notification-filters';
import { NotificationFilterPanel } from '../notification-filter-panel/notification-filter-panel';

/** The notifications design keeps sort and "الفلاتر" 8px apart. */
const CONTROL_GAP_PX = 8;

@Component({
  selector: 'app-notification-toolbar',
  imports: [FilterToolbar, NotificationFilterPanel],
  templateUrl: './notification-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationToolbar {
  readonly filters = input.required<NotificationFilters>();
  readonly activeFilterCount = input<number>(0);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly filtersApply = output<NotificationFilters>();

  protected readonly controlGap = CONTROL_GAP_PX;
}
