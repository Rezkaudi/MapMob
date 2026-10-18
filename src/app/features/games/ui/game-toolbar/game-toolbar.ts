import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSort } from '../../../../shared/models/list-sort';
import { ChipOption } from '../../../../shared/ui/filter-chips/chip-option';
import { FilterChips } from '../../../../shared/ui/filter-chips/filter-chips';
import { ListSearchField } from '../../../../shared/ui/list-search-field/list-search-field';
import { SortSelect } from '../../../../shared/ui/sort-select/sort-select';
import { GameStatus } from '../../models/game-status';
import { ALL_GAMES_CHIP } from '../../state/game-status-chips';

/** The top of the sessions card: round search, sort, and the status chips. */
@Component({
  selector: 'app-game-toolbar',
  imports: [FilterChips, ListSearchField, SortSelect],
  templateUrl: './game-toolbar.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameToolbar {
  readonly chips = input.required<readonly ChipOption[]>();
  readonly selectedChip = input<string>(ALL_GAMES_CHIP);
  readonly searchChange = output<string>();
  readonly sortChange = output<ListSort | null>();
  /** `null` is the "الكل" chip: every status. */
  readonly statusChange = output<GameStatus | null>();

  protected pickChip(value: string): void {
    this.statusChange.emit(value === ALL_GAMES_CHIP ? null : (value as GameStatus));
  }
}
