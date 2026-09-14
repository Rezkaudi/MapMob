import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { toCalendarDay } from '../../../../shared/formatting/calendar-day';
import { ConfirmDialogFlow } from '../../../../shared/state/confirm-dialog-flow';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { ExportButton } from '../../../../shared/ui/export-button/export-button';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { AppUser } from '../../models/user';
import { UsersStore } from '../../state/users.store';
import { UserDialogs } from '../../ui/user-dialogs/user-dialogs';
import { UserTable } from '../../ui/user-table/user-table';
import { UserToolbar } from '../../ui/user-toolbar/user-toolbar';

@Component({
  selector: 'app-user-list',
  imports: [
    ErrorState,
    ExportButton,
    PageHeader,
    StatCard,
    TablePagination,
    Toast,
    UserDialogs,
    UserTable,
    UserToolbar,
  ],
  templateUrl: './user-list.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserList {
  private readonly router = inject(Router);
  private readonly fileSaver = inject(FileSaver);
  private readonly clock = inject(CLOCK);

  protected readonly store = inject(UsersStore);
  protected readonly dialogFlow = new ConfirmDialogFlow<AppUser>({
    changeStatus: (id, status) => this.store.changeStatus(id, status),
    remove: (id) => this.store.deleteUser(id),
  });

  constructor() {
    this.store.loadUsers();
    this.store.loadSummary();
  }

  protected openDetail(user: AppUser): void {
    this.router.navigate(['/users', user.id]);
  }

  protected async exportUsers(): Promise<void> {
    const file = await this.store.exportUsers();
    if (file) {
      this.fileSaver.save(file, `users-${toCalendarDay(this.clock())}.csv`);
    }
  }

  protected closeDialog(): void {
    this.dialogFlow.close();
    this.store.clearSaveError();
  }
}
