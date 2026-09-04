import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DatePipe, DecimalPipe } from '@angular/common';
import { LucideDownload, LucideUsers } from '@lucide/angular';
import { ActionMenu } from '../../../../shared/ui/action-menu/action-menu';
import { Badge, BadgeTone } from '../../../../shared/ui/badge/badge';
import { Button } from '../../../../shared/ui/button/button';
import { SearchInput } from '../../../../shared/ui/search-input/search-input';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { USER_STATUS_LABEL, UserStatus } from '../../models/user-status';
import { UsersStore } from '../../state/users.store';

const STATUS_TONE: Record<UserStatus, BadgeTone> = {
  active: 'success',
  inactive: 'neutral',
};

@Component({
  selector: 'app-user-list',
  imports: [
    ActionMenu,
    Badge,
    Button,
    SearchInput,
    StatCard,
    TablePagination,
    DatePipe,
    DecimalPipe,
    LucideDownload,
  ],
  templateUrl: './user-list.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  protected readonly store = inject(UsersStore);
  protected readonly usersIcon = LucideUsers;
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
