import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LIST_SORT_LABEL, ListSort } from '../../../../shared/models/list-sort';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { SelectOption } from '../../../../shared/ui/select-field/select-option';

const SORT_OPTIONS: readonly SelectOption[] = (Object.keys(LIST_SORT_LABEL) as ListSort[]).map(
  (sort) => ({ value: sort, label: LIST_SORT_LABEL[sort] }),
);

@Component({
  selector: 'app-region-toolbar',
  imports: [AppIcon],
  templateUrl: './region-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionToolbar {
  readonly searchPlaceholder = input.required<string>();
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();

  protected readonly sortOptions = SORT_OPTIONS;

  protected onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }

  protected onSortChange(event: Event): void {
    const picked = (event.target as HTMLSelectElement).value;
    this.sortChange.emit(picked === '' ? null : (picked as ListSort));
  }
}
