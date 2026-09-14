import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { SelectOption } from '../../../../shared/ui/select-field/select-option';
import { REGION_SORT_LABEL, RegionSort } from '../../models/region-sort';

const SORT_OPTIONS: readonly SelectOption[] = (Object.keys(REGION_SORT_LABEL) as RegionSort[]).map(
  (sort) => ({ value: sort, label: REGION_SORT_LABEL[sort] }),
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
  readonly sortChange = output<RegionSort | null>();

  protected readonly sortOptions = SORT_OPTIONS;

  protected onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }

  protected onSortChange(event: Event): void {
    const picked = (event.target as HTMLSelectElement).value;
    this.sortChange.emit(picked === '' ? null : (picked as RegionSort));
  }
}
