import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { Toast } from '../../../../shared/ui/toast/toast';
import { DashboardAdminsStore } from '../../state/dashboard-admins.store';
import { AdminInviteDialog } from '../../ui/admin-invite-dialog/admin-invite-dialog';
import { AdminTable } from '../../ui/admin-table/admin-table';
import { SettingsAddButton } from '../../ui/settings-add-button/settings-add-button';
import { SettingsSectionHeading } from '../../ui/settings-section-heading/settings-section-heading';

@Component({
  selector: 'app-admin-settings',
  imports: [
    AdminInviteDialog,
    AdminTable,
    ErrorState,
    SettingsAddButton,
    SettingsSectionHeading,
    Toast,
  ],
  templateUrl: './admin-settings.html',
  providers: [DashboardAdminsStore],
  host: { class: 'flex flex-col gap-6' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminSettings {
  protected readonly store = inject(DashboardAdminsStore);

  constructor() {
    this.store.loadAdmins();
  }
}
