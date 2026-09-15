import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { LIST_SORT_LABEL, ListSort } from '../../models/list-sort';
import { AppIcon } from '../app-icon/app-icon';
import { SelectOption } from '../select-field/select-option';

const SORT_OPTIONS: readonly SelectOption[] = (Object.keys(LIST_SORT_LABEL) as ListSort[]).map(
  (sort) => ({ value: sort, label: LIST_SORT_LABEL[sort] }),
);

/** The 139×40 "ترتيب حسب" field the regions and users toolbars share. */
@Component({
  selector: 'app-sort-select',
  imports: [AppIcon],
  templateUrl: './sort-select.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortSelect {
  readonly sortChange = output<ListSort | null>();

  protected readonly sortOptions = SORT_OPTIONS;

  protected onSortChange(event: Event): void {
    const picked = (event.target as HTMLSelectElement).value;
    this.sortChange.emit(picked === '' ? null : (picked as ListSort));
  }
}
