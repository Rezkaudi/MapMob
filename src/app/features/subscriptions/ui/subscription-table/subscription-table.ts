import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { LatinDigitDatePipe } from '../../../../shared/pipes/latin-digit-date.pipe';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { Subscription } from '../../models/subscription';
import { PlanPill } from '../plan-pill/plan-pill';
import { SubscriptionStatusPill } from '../subscription-status-pill/subscription-status-pill';

/**
 * Column widths as shares of the 1046px design table (87 / 177 / 144 / 144 / 144 / 144 / 122 / 84px),
 * so each value sits under the centre of its header.
 */
const COLUMN_WIDTHS = ['8.32%', '16.92%', '13.77%', '13.77%', '13.77%', '13.77%', '11.66%', '8.02%'];
const DEFAULT_ROW_COUNT = 4;

@Component({
  selector: 'app-subscription-table',
  imports: [
    LatinDigitDatePipe,
    PlanPill,
    RowActionsMenu,
    SubscriptionStatusPill,
    TableEmpty,
    TableSkeleton,
  ],
  templateUrl: './subscription-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionTable {
  readonly entries = input.required<readonly Subscription[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly statusChange = output<Subscription>();
  readonly remove = output<Subscription>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
}
