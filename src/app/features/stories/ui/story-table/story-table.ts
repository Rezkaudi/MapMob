import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { StoryEntry } from '../../models/story-entry';
import { StoryRow } from '../../models/story-row';
import { StoryRowMenu } from '../story-row-menu/story-row-menu';
import { StoryThumbnail } from '../story-thumbnail/story-thumbnail';

/**
 * Column widths as shares of the 1046px frame table (64 / 205 / 175 / 170 / 163 / 160 / 109px),
 * so wider screens spread the columns instead of piling the spare room into one.
 */
const COLUMN_WIDTHS = ['6.12%', '19.6%', '16.73%', '16.25%', '15.58%', '15.3%', '10.42%'];
const DEFAULT_ROW_COUNT = 4;

@Component({
  selector: 'app-story-table',
  imports: [AppIcon, ArabicDatePipe, StoryRowMenu, StoryThumbnail, TableEmpty, TableSkeleton],
  templateUrl: './story-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryTable {
  readonly rows = input.required<readonly StoryRow[]>();
  readonly selectedIdSet = input<ReadonlySet<string>>(new Set());
  readonly areAllSelected = input<boolean>(false);
  readonly isLoading = input<boolean>(false);
  readonly hasNoResults = input<boolean>(false);
  readonly emptyMessage = input<string>('');
  readonly rowCount = input<number>(DEFAULT_ROW_COUNT);

  readonly rowToggle = output<string>();
  readonly allToggle = output<void>();
  readonly view = output<StoryEntry>();
  readonly hide = output<StoryEntry>();
  readonly show = output<StoryEntry>();
  readonly remove = output<StoryEntry>();

  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly columnCount = COLUMN_WIDTHS.length;

  protected changeVisibility(row: StoryRow): void {
    if (row.visibilityAction === 'show') {
      this.show.emit(row.story);
      return;
    }
    this.hide.emit(row.story);
  }
}
