import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ListSearchField } from '../../../../shared/ui/list-search-field/list-search-field';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { WinnerRow } from '../../models/winner-row';

/** Shares of the 844px frame table (152 / 237 / 231 / 189px, then the spare edge). */
const COLUMN_WIDTHS = ['18.01%', '28.08%', '27.37%', '22.39%', '4.15%'];

/** The winners tab of the detail modal: a search over one game's winners. */
@Component({
  selector: 'app-game-winner-list',
  imports: [ListSearchField, Skeleton],
  templateUrl: './game-winner-list.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameWinnerList {
  readonly rows = input.required<readonly WinnerRow[]>();
  readonly countText = input.required<string>();
  readonly isLoading = input<boolean>(false);
  readonly searchChange = output<string>();

  protected readonly columnWidths = COLUMN_WIDTHS;
}
