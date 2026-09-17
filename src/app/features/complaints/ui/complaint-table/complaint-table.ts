import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { Complaint } from '../../models/complaint';
import { ComplaintRow } from '../../state/complaint-row';
import { ComplaintStatusPill } from '../complaint-status-pill/complaint-status-pill';

/**
 * Column widths as shares of the 1046px design table (80 / 126 / 129 / 134 / 158 / 165 / 176 /
 * 78px), chosen so each centred value lands on the design's cell centre.
 */
const COLUMN_WIDTHS = [
  '7.65%',
  '12.05%',
  '12.33%',
  '12.81%',
  '15.11%',
  '15.77%',
  '16.83%',
  '7.45%',
];
const DEFAULT_ROW_COUNT = 4;

@Component({
  selector: 'app-complaint-table',
  imports: [ArabicDatePipe, ComplaintStatusPill, RowActionsMenu, TableEmpty, TableSkeleton],
  templateUrl: './complaint-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComplaintTable {
  readonly rows = input.required<readonly ComplaintRow[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly view = output<Complaint>();
  readonly remove = output<Complaint>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
}
