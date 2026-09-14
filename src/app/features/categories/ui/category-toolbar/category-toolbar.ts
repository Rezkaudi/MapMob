import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LIST_SORT_LABEL, ListSort } from '../../../../shared/models/list-sort';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ChipOption } from '../../../../shared/ui/filter-chips/chip-option';
import { FilterChips } from '../../../../shared/ui/filter-chips/filter-chips';
import { SelectField } from '../../../../shared/ui/select-field/select-field';
import { SelectOption } from '../../../../shared/ui/select-field/select-option';
import { CategoryKindChip } from '../../models/category-kind-chip';
import { CATEGORY_STATUS_LABEL, CategoryStatus } from '../../models/category-status';

function toOptions<T extends string>(labels: Record<T, string>): readonly SelectOption[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}

const SORT_OPTIONS = toOptions(LIST_SORT_LABEL);
const STATUS_OPTIONS = toOptions(CATEGORY_STATUS_LABEL);

@Component({
  selector: 'app-category-toolbar',
  imports: [AppIcon, FilterChips, SelectField],
  templateUrl: './category-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryToolbar {
  readonly parentOptions = input.required<readonly SelectOption[]>();
  readonly kindChips = input.required<readonly ChipOption[]>();
  readonly selectedKindChip = input.required<CategoryKindChip>();

  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly statusChange = output<CategoryStatus | null>();
  readonly parentChange = output<string | null>();
  readonly kindChipChange = output<CategoryKindChip>();

  protected readonly sortOptions = SORT_OPTIONS;
  protected readonly statusOptions = STATUS_OPTIONS;

  protected onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
