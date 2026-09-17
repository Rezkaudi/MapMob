import { AdminInvitation } from '../models/admin-invitation';
import { AdminRole } from '../models/admin-role';
import { DashboardAdmin } from '../models/dashboard-admin';
import { RoleDraft } from '../models/role-draft';
import { nextMockId } from './next-mock-id';

const ADMIN_ID_PREFIX = 'admin-';
const ROLE_ID_PREFIX = 'role-';

/** Roles and the admins who hold them, kept together so each role knows its admin count. */
export class AdminTeamMockRecords {
  constructor(
    private roleList: readonly AdminRole[],
    private adminList: readonly DashboardAdmin[],
  ) {}

  roles(): readonly AdminRole[] {
    return this.roleList.map((role) => this.withAdminCount(role));
  }

  admins(): readonly DashboardAdmin[] {
    return this.adminList;
  }

  inviteAdmin({ fullName, email, roleId }: AdminInvitation): DashboardAdmin {
    const normalizedEmail = email.trim().toLowerCase();
    if (this.adminList.some((admin) => admin.email.toLowerCase() === normalizedEmail)) {
      throw new Error('البريد الإلكتروني مستخدم لمشرف آخر');
    }
    const admin: DashboardAdmin = {
      id: nextMockId(ADMIN_ID_PREFIX, this.adminList),
      fullName,
      email: normalizedEmail,
      roleId,
      roleName: this.findRole(roleId).name,
      status: 'active',
      lastSignInOn: null,
    };
    this.adminList = [...this.adminList, admin];
    return admin;
  }

  addRole(draft: RoleDraft): AdminRole {
    const role: AdminRole = {
      id: nextMockId(ROLE_ID_PREFIX, this.roleList),
      englishName: '',
      icon: 'shield',
      isFullAccess: false,
      adminCount: 0,
      ...draft,
    };
    this.roleList = [...this.roleList, role];
    return role;
  }

  updateRole(id: string, draft: RoleDraft): AdminRole {
    if (this.findRole(id).isFullAccess) {
      throw new Error('لا يمكن تعديل دور مدير النظام');
    }
    this.roleList = this.roleList.map((role) => (role.id === id ? { ...role, ...draft } : role));
    this.adminList = this.adminList.map((admin) =>
      admin.roleId === id ? { ...admin, roleName: draft.name } : admin,
    );
    return this.withAdminCount(this.findRole(id));
  }

  deleteRole(id: string): void {
    const role = this.withAdminCount(this.findRole(id));
    if (role.isFullAccess) {
      throw new Error('لا يمكن حذف دور مدير النظام');
    }
    if (role.adminCount > 0) {
      throw new Error('لا يمكن حذف دور مرتبط بمشرفين. انقل المشرفين إلى دور آخر أولاً.');
    }
    this.roleList = this.roleList.filter((candidate) => candidate.id !== id);
  }

  private withAdminCount(role: AdminRole): AdminRole {
    const adminCount = this.adminList.filter((admin) => admin.roleId === role.id).length;
    return { ...role, adminCount };
  }

  private findRole(id: string): AdminRole {
    const role = this.roleList.find((candidate) => candidate.id === id);
    if (!role) {
      throw new Error('لم يتم العثور على الدور');
    }
    return role;
  }
}
