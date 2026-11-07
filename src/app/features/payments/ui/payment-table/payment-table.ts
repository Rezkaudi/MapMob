import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { PAYMENT_METHOD_LABELS } from '../../models/payment-method-labels';
import { Payment } from '../../models/payment';

/**
 * Column widths as shares of the design's columns (checkbox 67 / رقم العملية 120 / الشركة 150 /
 * المبلغ 140 / التاريخ 126 / الطريقة 132 / الايصال 140 / ملاحظات 118px) plus a 70px action column.
 */
const COLUMN_WIDTHS = [
  '6.30%',
  '11.29%',
  '14.11%',
  '13.17%',
  '11.85%',
  '12.42%',
  '13.17%',
  '11.10%',
  '6.59%',
];
const DEFAULT_ROW_COUNT = 4;

@Component({
  selector: 'app-payment-table',
  imports: [ArabicDatePipe, RowActionsMenu, TableEmpty, TableSkeleton],
  templateUrl: './payment-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentTable {
  readonly entries = input.required<readonly Payment[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly view = output<Payment>();
  readonly edit = output<Payment>();
  readonly remove = output<Payment>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
  protected readonly methodLabels = PAYMENT_METHOD_LABELS;
}
