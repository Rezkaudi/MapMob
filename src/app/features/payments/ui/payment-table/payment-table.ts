import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { PAYMENT_METHOD_LABELS } from '../../models/payment-method';
import { Payment } from '../../models/payment';

/**
 * Column widths as shares of the design's 993px inner table (checkbox 67 / رقم العملية 120 /
 * الشركة 150 / المبلغ 140 / التاريخ 126 / الطريقة 132 / الايصال 140 / ملاحظات 118px).
 */
const COLUMN_WIDTHS = [
  '6.75%',
  '12.08%',
  '15.11%',
  '14.10%',
  '12.69%',
  '13.29%',
  '14.10%',
  '11.88%',
];
const DEFAULT_ROW_COUNT = 4;

@Component({
  selector: 'app-payment-table',
  imports: [ArabicDatePipe, TableEmpty, TableSkeleton],
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

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
  protected readonly methodLabels = PAYMENT_METHOD_LABELS;
}
