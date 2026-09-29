import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { StatusPill } from '../../../../shared/ui/status-pill/status-pill';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { DeliveryPlatformEntry } from '../../models/delivery-platform-entry';
import {
  DeliveryPlatformLabels,
  describeDeliveryPlatform,
} from '../../state/delivery-platform-labels';
import { BrandLogo } from '../brand-logo/brand-logo';

/**
 * Column widths as shares of the 1046px frame table (76 / 137 / 145 / 192 / 142 / 116 / 150 / 88px),
 * so wider screens spread the columns instead of piling the spare room into one.
 */
const COLUMN_WIDTHS = ['7.27%', '13.1%', '13.86%', '18.36%', '13.58%', '11.09%', '14.34%', '8.4%'];
const DEFAULT_ROW_COUNT = 4;

interface DeliveryPlatformRow extends DeliveryPlatformLabels {
  readonly platform: DeliveryPlatformEntry;
}

@Component({
  selector: 'app-delivery-platform-table',
  imports: [ArabicDatePipe, BrandLogo, RowActionsMenu, StatusPill, TableEmpty, TableSkeleton],
  templateUrl: './delivery-platform-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryPlatformTable {
  readonly entries = input.required<readonly DeliveryPlatformEntry[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly edit = output<DeliveryPlatformEntry>();
  readonly viewStores = output<DeliveryPlatformEntry>();
  readonly statusChange = output<DeliveryPlatformEntry>();
  readonly remove = output<DeliveryPlatformEntry>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
  protected readonly rows = computed<readonly DeliveryPlatformRow[]>(() =>
    this.entries().map((platform) => ({ platform, ...describeDeliveryPlatform(platform) })),
  );
}
