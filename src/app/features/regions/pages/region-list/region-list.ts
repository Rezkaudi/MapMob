import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { Badge, BadgeTone } from '../../../../shared/ui/badge/badge';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { TableToolbar } from '../../../../shared/ui/table-toolbar/table-toolbar';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { REGION_STATUS_LABEL, RegionStatus } from '../../models/region-status';
import { RegionsStore } from '../../state/regions.store';

const STATUS_TONE: Record<RegionStatus, BadgeTone> = {
  active: 'success',
  suspended: 'error',
};

@Component({
  selector: 'app-region-list',
  imports: [AppIcon, ActionMenu, Badge, TablePagination, TableToolbar, ArabicDatePipe],
  templateUrl: './region-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionList {
  protected readonly store = inject(RegionsStore);
  protected readonly statusLabel = REGION_STATUS_LABEL;
  protected readonly statusTone = STATUS_TONE;

  constructor() {
    this.store.loadRegions();
  }

  protected onSearch(search: string): void {
    this.store.setSearch(search);
  }

  protected onPageChange(pageIndex: number): void {
    this.store.changePage(pageIndex);
  }
}
