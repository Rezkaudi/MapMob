import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { GameEntry } from '../../models/game-entry';
import { GameRow } from '../../models/game-row';
import { GameRowMenu } from '../game-row-menu/game-row-menu';

/**
 * Column widths as shares of the 1046px frame table (210 / 145 / 140 / 171 / 153 / 115 / 112px),
 * measured from where each header starts, so wider screens spread the columns evenly.
 */
const COLUMN_WIDTHS = ['20.08%', '13.86%', '13.38%', '16.35%', '14.63%', '10.99%', '10.71%'];
const DEFAULT_ROW_COUNT = 3;

@Component({
  selector: 'app-game-table',
  imports: [GameRowMenu, TableEmpty, TableSkeleton],
  templateUrl: './game-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameTable {
  readonly rows = input.required<readonly GameRow[]>();
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);
  readonly view = output<GameEntry>();
  readonly edit = output<GameEntry>();
  readonly remove = output<GameEntry>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
}
