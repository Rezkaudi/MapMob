import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Toast } from '../../../../shared/ui/toast/toast';
import { AdminRolesStore } from '../../state/admin-roles.store';
import { RoleCard } from '../../ui/role-card/role-card';
import { RoleDialog } from '../../ui/role-dialog/role-dialog';
import { SettingsAddButton } from '../../ui/settings-add-button/settings-add-button';
import { SettingsSectionHeading } from '../../ui/settings-section-heading/settings-section-heading';
import { ROLE_DELETE_COPY, ROLE_SAVED_MESSAGE, ROLE_SAVED_TITLES } from './role-settings-copy';

const CARD_PLACEHOLDER_COUNT = 3;

@Component({
  selector: 'app-role-settings',
  imports: [
    ConfirmActionDialog,
    ErrorState,
    RoleCard,
    RoleDialog,
    SettingsAddButton,
    SettingsSectionHeading,
    Skeleton,
    Toast,
  ],
  templateUrl: './role-settings.html',
  providers: [AdminRolesStore],
  host: { class: 'flex flex-col gap-6' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleSettings {
  protected readonly store = inject(AdminRolesStore);
  protected readonly deleteCopy = ROLE_DELETE_COPY;
  protected readonly savedMessage = ROLE_SAVED_MESSAGE;
  protected readonly placeholderCards = Array.from({ length: CARD_PLACEHOLDER_COUNT });
  protected readonly savedTitle = computed(() => {
    const notice = this.store.savedNotice();
    return notice ? ROLE_SAVED_TITLES[notice] : null;
  });

  constructor() {
    this.store.loadRoles();
  }
}
