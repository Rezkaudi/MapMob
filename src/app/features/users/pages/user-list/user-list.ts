import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { Badge, BadgeTone } from '../../../../shared/ui/badge/badge';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { TableEmpty } from '../../../../shared/ui/table-empty/table-empty';
import { TableSkeleton } from '../../../../shared/ui/table-skeleton/table-skeleton';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { TableToolbar } from '../../../../shared/ui/table-toolbar/table-toolbar';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { USER_STATUS_LABEL, UserStatus } from '../../models/user-status';
import { UsersStore } from '../../state/users.store';

/** Tick box, six data columns and the action column. */
const TABLE_COLUMN_COUNT = 8;

const STATUS_TONE: Record<UserStatus, BadgeTone> = {
  active: 'success',
  inactive: 'neutral',
};

@Component({
  selector: 'app-user-list',
  imports: [
    AppIcon,
    ActionMenu,
    Badge,
    ErrorState,
    TableEmpty,
    TableSkeleton,
    StatCard,
    TablePagination,
    TableToolbar,
    ArabicDatePipe,
    DecimalPipe,
  ],
  templateUrl: './user-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  protected readonly tableColumnCount = TABLE_COLUMN_COUNT;
  protected readonly store = inject(UsersStore);
  protected readonly statusLabel = USER_STATUS_LABEL;
  protected readonly statusTone = STATUS_TONE;

  constructor() {
    this.store.loadUsers();
  }

  protected onSearch(search: string): void {
    this.store.setSearch(search);
  }

  protected onPageChange(pageIndex: number): void {
    this.store.changePage(pageIndex);
  }
}
