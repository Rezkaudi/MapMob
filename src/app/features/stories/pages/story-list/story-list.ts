import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { toCalendarDay } from '../../../../shared/formatting/calendar-day';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { StoryDetailDrawer } from '../../../../shared/ui/story-detail-drawer/story-detail-drawer';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { StoriesStore } from '../../state/stories.store';
import { StoryFilterBar } from '../../ui/story-filter-bar/story-filter-bar';
import { StoryTable } from '../../ui/story-table/story-table';

@Component({
  selector: 'app-story-list',
  imports: [
    ConfirmActionDialog,
    ErrorState,
    PageHeader,
    StatCard,
    StoryDetailDrawer,
    StoryFilterBar,
    StoryTable,
    TablePagination,
    Toast,
  ],
  providers: [StoriesStore],
  templateUrl: './story-list.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryList {
  private readonly fileSaver = inject(FileSaver);
  private readonly clock = inject(CLOCK);
  protected readonly store = inject(StoriesStore);

  constructor() {
    this.reload();
  }

  protected reload(): void {
    this.store.loadStories();
    this.store.loadSummary();
  }

  /** Ticked rows go out alone; with none ticked, every story the filters match. */
  protected async exportStories(): Promise<void> {
    const file = await this.store.exportStories();
    if (file) {
      this.fileSaver.save(file, `stories-${toCalendarDay(this.clock())}.csv`);
    }
  }
}
