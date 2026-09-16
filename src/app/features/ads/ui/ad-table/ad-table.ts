import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { CampaignStatusPill } from '../../../../shared/ui/campaign-status-pill/campaign-status-pill';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { Ad } from '../../models/ad';
import { AD_CONTENT_TYPE_LABEL } from '../../models/ad-content-type';
import { AD_PLACEMENT_LABEL } from '../../models/ad-placement';
import { formatAdPeriod } from '../../state/ad-period-label';
import { formatAdPlace } from '../../state/ad-place-label';

/**
 * Column widths as shares of the 1046px design table (80 / 130 / 146 / 118 / 117 / 136 / 75 / 153 / 91px),
 * picked so each value sits under the centre of its header.
 */
const COLUMN_WIDTHS = [
  '7.65%',
  '12.43%',
  '13.96%',
  '11.28%',
  '11.19%',
  '13%',
  '7.17%',
  '14.63%',
  '8.69%',
];
const DEFAULT_ROW_COUNT = 4;

interface AdTableRow {
  readonly ad: Ad;
  readonly placeLabel: string;
  readonly contentTypeLabel: string;
  readonly placementLabel: string;
  readonly periodLabel: string;
}

@Component({
  selector: 'app-ad-table',
  imports: [CampaignStatusPill, RowActionsMenu, TableEmpty, TableSkeleton],
  templateUrl: './ad-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdTable {
  readonly entries = input.required<readonly Ad[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly edit = output<Ad>();
  readonly remove = output<Ad>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;
  protected readonly rows = computed<readonly AdTableRow[]>(() =>
    this.entries().map((ad) => ({
      ad,
      placeLabel: formatAdPlace(ad),
      contentTypeLabel: AD_CONTENT_TYPE_LABEL[ad.contentType],
      placementLabel: AD_PLACEMENT_LABEL[ad.placement],
      periodLabel: formatAdPeriod(ad.startsOn, ad.endsOn),
    })),
  );
}
