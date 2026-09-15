import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { FilterToolbar } from '../../../../shared/ui/filter-toolbar/filter-toolbar';
import { UserFilters } from '../../models/user-filters';
import { UserFilterPanel } from '../user-filter-panel/user-filter-panel';

@Component({
  selector: 'app-user-toolbar',
  imports: [FilterToolbar, UserFilterPanel],
  templateUrl: './user-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserToolbar {
  readonly filters = input.required<UserFilters>();
  readonly activeFilterCount = input<number>(0);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly filtersApply = output<UserFilters>();
}
