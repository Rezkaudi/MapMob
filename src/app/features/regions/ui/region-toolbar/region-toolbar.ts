import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { ListSearchField } from '../../../../shared/ui/list-search-field/list-search-field';
import { SortSelect } from '../../../../shared/ui/sort-select/sort-select';

@Component({
  selector: 'app-region-toolbar',
  imports: [ListSearchField, SortSelect],
  templateUrl: './region-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionToolbar {
  readonly searchPlaceholder = input.required<string>();
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
}
