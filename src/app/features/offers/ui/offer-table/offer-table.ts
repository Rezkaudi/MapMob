import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { Offer } from '../../models/offer';
import { CampaignStatusPill } from '../../../../shared/ui/campaign-status-pill/campaign-status-pill';

/**
 * Column widths as shares of the 1046px design table (80 / 130 / 152 / 138 / 162 / 148 / 132 / 104px),
 * picked so each value sits under the centre of its header, as the design draws them.
 */
const COLUMN_WIDTHS = [
  '7.65%',
  '12.43%',
  '14.53%',
  '13.19%',
  '15.49%',
  '14.15%',
  '12.62%',
  '9.94%',
];
const DEFAULT_ROW_COUNT = 4;

@Component({
  selector: 'app-offer-table',
  imports: [ArabicDatePipe, CampaignStatusPill, RowActionsMenu, TableEmpty, TableSkeleton],
  templateUrl: './offer-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferTable {
  readonly entries = input.required<readonly Offer[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly view = output<Offer>();
  readonly remove = output<Offer>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
}
