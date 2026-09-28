import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { ListSearchField } from '../../../../shared/ui/list-search-field/list-search-field';
import { SortSelect } from '../../../../shared/ui/sort-select/sort-select';

@Component({
  selector: 'app-product-toolbar',
  imports: [ListSearchField, SortSelect],
  templateUrl: './product-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductToolbar {
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
}
