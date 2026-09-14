import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { RegionEntry } from '../../models/region-entry';
import { RegionStatusPill } from '../region-status-pill/region-status-pill';

/** Tick box, five data columns and the action column. */
const TABLE_COLUMN_COUNT = 7;
const DEFAULT_ROW_COUNT = 5;

export type RegionEntryLink = (entry: RegionEntry) => readonly string[];

interface RegionTableRow {
  readonly entry: RegionEntry;
  readonly link: readonly string[] | null;
}

@Component({
  selector: 'app-region-table',
  imports: [
    ActionMenu,
    AppIcon,
    ArabicDatePipe,
    RegionStatusPill,
    RouterLink,
    TableEmpty,
    TableSkeleton,
  ],
  templateUrl: './region-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionTable {
  readonly nameHeader = input.required<string>();
  readonly entries = input.required<readonly RegionEntry[]>();
  readonly entryLink = input<RegionEntryLink | null>(null);
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly edit = output<RegionEntry>();
  readonly statusChange = output<RegionEntry>();
  readonly remove = output<RegionEntry>();

  protected readonly columnCount = TABLE_COLUMN_COUNT;
  protected readonly rows = computed<readonly RegionTableRow[]>(() => {
    const linkFor = this.entryLink();
    return this.entries().map((entry) => ({ entry, link: linkFor ? linkFor(entry) : null }));
  });
}
