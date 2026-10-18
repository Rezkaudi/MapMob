import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ListSearchField } from '../../../../shared/ui/list-search-field/list-search-field';
import { SortSelect } from '../../../../shared/ui/sort-select/sort-select';

/** The top of the winners card: its title, the file export, then search and sort. */
@Component({
  selector: 'app-winner-toolbar',
  imports: [AppIcon, ListSearchField, SortSelect],
  templateUrl: './winner-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnerToolbar {
  readonly isExporting = input<boolean>(false);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  readonly exportRequested = output<void>();
}
