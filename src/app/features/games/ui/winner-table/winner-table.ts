import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { GameWinner } from '../../models/game-winner';
import { WinnerRow } from '../../models/winner-row';
import { WinnerRowMenu } from '../winner-row-menu/winner-row-menu';

/** Shares of the 1044px frame table (210 / 161 / 162 / 140 / 133 / 133 / 105px). */
const COLUMN_WIDTHS = ['20.11%', '15.42%', '15.52%', '13.41%', '12.74%', '12.74%', '10.06%'];
const DEFAULT_ROW_COUNT = 4;

@Component({
  selector: 'app-winner-table',
  imports: [TableEmpty, TableSkeleton, WinnerRowMenu],
  templateUrl: './winner-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WinnerTable {
  readonly rows = input.required<readonly WinnerRow[]>();
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);
  readonly view = output<GameWinner>();
  readonly statusChange = output<GameWinner>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
}
