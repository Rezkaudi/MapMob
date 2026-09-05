import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { Badge, BadgeTone } from '../../../../shared/ui/badge/badge';
import { BulkActionBar } from '../../../../shared/ui/bulk-action-bar/bulk-action-bar';
import { ChipOption } from '../../../../shared/ui/filter-chips/chip-option';
import { ConfirmDialog } from '../../../../shared/ui/confirm-dialog/confirm-dialog';
import { EmptyState } from '../../../../shared/ui/empty-state/empty-state';
import { SelectOption } from '../../../../shared/ui/select-field/select-option';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { PLACE_PACKAGE_LABEL, PlacePackage } from '../../models/place-package';
import { PLACE_SORT_LABEL, PlaceSort } from '../../models/place-sort';
import { PLACE_STATUS_LABEL, PlaceStatus } from '../../models/place-status';
import { PlacesStore } from '../../state/places.store';
import { PackageBadge } from './package-badge/package-badge';
import { PlaceFilters } from './place-filters/place-filters';
import { PlaceLogo } from './place-logo/place-logo';
import { BulkAction, BULK_ACTION_DIALOG } from './bulk-action';

const STATUS_TONE: Record<PlaceStatus, BadgeTone> = {
  active: 'success',
  suspended: 'error',
  pending: 'warning',
};

const STATUS_DOT: Record<PlaceStatus, string> = {
  active: 'bg-status-success',
  pending: 'bg-status-warning',
  suspended: 'bg-status-error',
};

const CATEGORIES = ['صيدلية', 'مطعم', 'مقهى', 'سوبر ماركت', 'عيادة'];
const ALL_STATUSES: readonly PlaceStatus[] = ['active', 'pending', 'suspended'];

function toOptions<T extends string>(labels: Record<T, string>): SelectOption[] {
  return (Object.keys(labels) as T[]).map((value) => ({ value, label: labels[value] }));
}

@Component({
  selector: 'app-place-list',
  imports: [
    AppIcon,
    ActionMenu,
    Badge,
    BulkActionBar,
    ConfirmDialog,
    EmptyState,
    PackageBadge,
    PlaceFilters,
    PlaceLogo,
    TablePagination,
    ArabicDatePipe,
    DecimalPipe,
    RouterLink,
  ],
  templateUrl: './place-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceList {
  protected readonly store = inject(PlacesStore);
  protected readonly statusLabel = PLACE_STATUS_LABEL;
  protected readonly statusTone = STATUS_TONE;

  protected readonly categoryOptions: SelectOption[] = CATEGORIES.map((category) => ({
    value: category,
    label: category,
  }));
  protected readonly packageOptions = toOptions<PlacePackage>(PLACE_PACKAGE_LABEL);
  protected readonly sortOptions = toOptions<PlaceSort>(PLACE_SORT_LABEL);

  protected readonly statusChips = computed<ChipOption[]>(() => {
    const counts = this.store.statusCounts();
    return [
      { value: 'all', label: 'الكل', count: counts.all },
      ...ALL_STATUSES.map((status) => ({
        value: status,
        label: PLACE_STATUS_LABEL[status],
        count: counts[status],
        dotClass: STATUS_DOT[status],
      })),
    ];
  });

  protected readonly selectedStatus = computed(() => this.store.status() ?? 'all');

  protected readonly pendingAction = signal<BulkAction | null>(null);
  protected readonly dialog = computed(() => {
    const action = this.pendingAction();
    return action ? BULK_ACTION_DIALOG[action] : null;
  });

  constructor() {
    this.store.loadPlaces();
    this.store.loadStatusCounts();
  }

  protected onSearch(search: string): void {
    this.store.setSearch(search);
  }

  protected onStatusChange(status: string): void {
    this.store.setStatusFilter(status === 'all' ? null : (status as PlaceStatus));
  }

  protected onCategoryChange(category: string | null): void {
    this.store.setCategoryFilter(category);
  }

  protected onPackageChange(placePackage: string | null): void {
    this.store.setPackageFilter(placePackage as PlacePackage | null);
  }

  protected onSortChange(sort: string | null): void {
    this.store.setSort(sort as PlaceSort | null);
  }

  protected onPageChange(pageIndex: number): void {
    this.store.changePage(pageIndex);
  }

  protected askFor(action: BulkAction): void {
    this.pendingAction.set(action);
  }

  /** The write endpoints are not built yet, so confirming only clears the selection. */
  protected confirmAction(): void {
    this.pendingAction.set(null);
    this.store.clearSelection();
  }

  protected cancelAction(): void {
    this.pendingAction.set(null);
  }
}
