import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { ChipOption } from '../../../../../shared/ui/filter-chips/chip-option';
import { FilterChips } from '../../../../../shared/ui/filter-chips/filter-chips';
import { SelectField } from '../../../../../shared/ui/select-field/select-field';
import { SelectOption } from '../../../../../shared/ui/select-field/select-option';

@Component({
  selector: 'app-place-filters',
  imports: [AppIcon, FilterChips, SelectField],
  templateUrl: './place-filters.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceFilters {
  readonly categories = input.required<readonly SelectOption[]>();
  readonly packages = input.required<readonly SelectOption[]>();
  readonly sorts = input.required<readonly SelectOption[]>();
  readonly statusChips = input.required<readonly ChipOption[]>();
  readonly selectedStatus = input<string>('all');

  readonly searchChange = output<string>();
  readonly categoryChange = output<string | null>();
  readonly packageChange = output<string | null>();
  readonly sortChange = output<string | null>();
  readonly statusChange = output<string>();

  protected onSearchInput(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
