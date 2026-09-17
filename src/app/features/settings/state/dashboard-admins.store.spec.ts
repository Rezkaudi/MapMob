import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminsRepository } from '../data/admins.repository';
import { RolesRepository } from '../data/roles.repository';
import { buildAdminRole, buildDashboardAdmin } from '../testing/settings-fixture';
import { DashboardAdminsStore } from './dashboard-admins.store';

const SUPER_ROLE = buildAdminRole({ id: 'role-1', name: 'مدير النظام', isFullAccess: true });
const ADMIN_ROLE = buildAdminRole();
const INACTIVE_ROLE = buildAdminRole({ id: 'role-9', name: 'قديم', isActive: false });
const ADMIN = buildDashboardAdmin();
const INVITATION = { fullName: 'يوسف محمد', email: 'yousef@mapmob.com', roleId: 'role-2' };

function createStore(admins: Partial<AdminsRepository> = {}, roles: Partial<RolesRepository> = {}) {
  TestBed.configureTestingModule({
    providers: [
      DashboardAdminsStore,
      {
        provide: AdminsRepository,
        useValue: {
          getAdmins: () => of([ADMIN]),
          inviteAdmin: () =>
            of(buildDashboardAdmin({ id: 'admin-9', ...INVITATION, lastSignInOn: null })),
          ...admins,
        },
      },
      {
        provide: RolesRepository,
        useValue: { getRoles: () => of([SUPER_ROLE, ADMIN_ROLE, INACTIVE_ROLE]), ...roles },
      },
    ],
  });
  const store = TestBed.inject(DashboardAdminsStore);
  store.loadAdmins();
  return store;
}

describe('DashboardAdminsStore', () => {
  it('loads the admins and the roles they can be given', () => {
    const store = createStore();

    expect(store.admins()).toEqual([ADMIN]);
    expect(store.assignableRoles()).toEqual([SUPER_ROLE, ADMIN_ROLE]);
  });

  it('suggests the first role that is not full access for a new admin', () => {
    expect(createStore().suggestedRoleId()).toBe('role-2');
  });

  it('reports a failed load of either list', () => {
    const store = createStore(
      {},
      { getRoles: () => throwError(() => new Error('تعذر تحميل الأدوار')) },
    );

    expect(store.error()).toBe('تعذر تحميل الأدوار');
  });

  it('invites an admin through the dialog and confirms it', async () => {
    const store = createStore();
    store.openInviteDialog();
    expect(store.isInviteDialogOpen()).toBe(true);

    expect(await store.inviteAdmin(INVITATION)).toBe(true);

    expect(store.admins().map((admin) => admin.id)).toEqual(['admin-2', 'admin-9']);
    expect(store.isInviteDialogOpen()).toBe(false);
    expect(store.hasInvited()).toBe(true);
  });

  it('keeps the dialog open with the error when the invite fails', async () => {
    const store = createStore({
      inviteAdmin: () => throwError(() => new Error('البريد الإلكتروني مستخدم لمشرف آخر')),
    });
    store.openInviteDialog();

    expect(await store.inviteAdmin(INVITATION)).toBe(false);

    expect(store.isInviteDialogOpen()).toBe(true);
    expect(store.saveError()).toBe('البريد الإلكتروني مستخدم لمشرف آخر');
    store.closeInviteDialog();
    expect(store.saveError()).toBeNull();
  });
});
