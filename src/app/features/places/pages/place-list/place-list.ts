import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { LucidePlus } from '@lucide/angular';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { Badge, BadgeTone } from '../../../../shared/ui/badge/badge';
import { Button } from '../../../../shared/ui/button/button';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { SearchInput } from '../../../../shared/ui/search-input/search-input';
import { StarRating } from '../../../../shared/ui/star-rating/star-rating';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
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
    ActionMenu,
    Badge,
    Button,
    EmptyState,
    SearchInput,
    StarRating,
    TablePagination,
    DatePipe,
    LucidePlus,
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
