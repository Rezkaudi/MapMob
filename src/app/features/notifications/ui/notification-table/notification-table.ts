import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { AppNotification } from '../../models/notification';
import { NotificationRow } from '../../state/notification-row';
import { NotificationStatusPill } from '../notification-status-pill/notification-status-pill';

/**
 * Column widths as shares of the 1046px design table (72 / 136 / 135 / 118 / 158 / 160.5 / 185.5 /
 * 81px): each boundary sits halfway between the design's cell boxes.
 */
const COLUMN_WIDTHS = ['6.88%', '13%', '12.91%', '11.28%', '15.11%', '15.34%', '17.73%', '7.75%'];
const DEFAULT_ROW_COUNT = 4;

@Component({
  selector: 'app-notification-table',
  imports: [ArabicDatePipe, NotificationStatusPill, RowActionsMenu, TableEmpty, TableSkeleton],
  templateUrl: './notification-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationTable {
  readonly rows = input.required<readonly NotificationRow[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly view = output<AppNotification>();
  readonly edit = output<AppNotification>();
  readonly duplicate = output<AppNotification>();
  readonly remove = output<AppNotification>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
}
