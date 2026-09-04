import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucidePlus } from '@lucide/angular';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { Badge, BadgeTone } from '../../../../shared/ui/badge/badge';
import { Button } from '../../../../shared/ui/button/button';
import { SearchInput } from '../../../../shared/ui/search-input/search-input';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { REGION_STATUS_LABEL, RegionStatus } from '../../models/region-status';
import { RegionsStore } from '../../state/regions.store';

const STATUS_TONE: Record<RegionStatus, BadgeTone> = {
  active: 'success',
  suspended: 'error',
};

@Component({
  selector: 'app-region-list',
  imports: [ActionMenu, Badge, Button, SearchInput, TablePagination, DatePipe, LucidePlus],
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
