import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { AdminRole } from '../../models/admin-role';
import { AdminRoleIcon } from '../../models/admin-role-icon';
import { allPermissionGrants } from '../../state/permission-modules';
import { describeAdminCount, describePermissionCount } from '../../state/role-count-words';

interface RoleIconSkin {
  readonly icon: string;
  readonly tileClasses: string;
}

const ROLE_ICON_SKINS: Record<AdminRoleIcon, RoleIconSkin> = {
  shield: { icon: 'shield-check', tileClasses: 'bg-[#d4e3ff] text-primary' },
  headset: { icon: 'headset', tileClasses: 'bg-status-success/16 text-status-success' },
};

@Component({
  selector: 'app-role-card',
  imports: [AppIcon],
  templateUrl: './role-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RoleCard {
  readonly role = input.required<AdminRole>();
  /** Edit a custom role, or view the permissions of the full access one. */
  readonly open = output<AdminRole>();
  readonly remove = output<AdminRole>();

  protected readonly skin = computed(() => ROLE_ICON_SKINS[this.role().icon]);
  protected readonly adminCountLabel = computed(() => describeAdminCount(this.role().adminCount));
  protected readonly permissionCountLabel = computed(() => {
    const role = this.role();
    const count = role.isFullAccess ? allPermissionGrants().length : role.grants.length;
    return describePermissionCount(count, role.isFullAccess);
  });
}
