import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { Badge, BadgeTone } from '../../../../shared/ui/badge/badge';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { TableToolbar } from '../../../../shared/ui/table-toolbar/table-toolbar';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { PLACE_STATUS_LABEL, PlaceStatus } from '../../models/place-status';
import { PlacesStore } from '../../state/places.store';

const STATUS_TONE: Record<PlaceStatus, BadgeTone> = {
  active: 'success',
  suspended: 'error',
  pending: 'warning',
};

@Component({
  selector: 'app-place-list',
  imports: [
    AppIcon,
    ActionMenu,
    Badge,
    EmptyState,
    TablePagination,
    TableToolbar,
    ArabicDatePipe,
    DecimalPipe,
  ],
  templateUrl: './place-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceList {
  protected readonly store = inject(PlacesStore);
  protected readonly statusLabel = PLACE_STATUS_LABEL;
  protected readonly statusTone = STATUS_TONE;

  constructor() {
    this.store.loadPlaces();
  }

  protected onSearch(search: string): void {
    this.store.setSearch(search);
  }

  protected onPageChange(pageIndex: number): void {
    this.store.changePage(pageIndex);
  }
}
