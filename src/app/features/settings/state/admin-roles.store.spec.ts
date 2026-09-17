import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RolesRepository } from '../data/roles.repository';
import { buildAdminRole } from '../testing/settings-fixture';
import { AdminRolesStore } from './admin-roles.store';

const SUPER_ROLE = buildAdminRole({ id: 'role-1', name: 'مدير النظام', isFullAccess: true });
const ADMIN_ROLE = buildAdminRole();
const DRAFT = {
  name: 'مشرف عمليات',
  description: 'وصف',
  isActive: true,
  grants: ['home:view'],
} as const;

function createStore(overrides: Partial<RolesRepository> = {}) {
  const repository: Partial<RolesRepository> = {
    getRoles: () => of([SUPER_ROLE, ADMIN_ROLE]),
    addRole: (draft) => of(buildAdminRole({ id: 'role-3', adminCount: 0, ...draft })),
    updateRole: (id, draft) => of({ ...ADMIN_ROLE, id, ...draft }),
    deleteRole: () => of(undefined),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [AdminRolesStore, { provide: RolesRepository, useValue: repository }],
  });
  const store = TestBed.inject(AdminRolesStore);
  store.loadRoles();
  return store;
}

describe('AdminRolesStore', () => {
  it('loads the roles', () => {
    expect(createStore().roles()).toEqual([SUPER_ROLE, ADMIN_ROLE]);
  });

  it('opens the full access role read-only and any other role for editing', () => {
    const store = createStore();

    store.openRole(SUPER_ROLE);
    expect(store.dialog()).toEqual({ mode: 'view', role: SUPER_ROLE });

    store.openRole(ADMIN_ROLE);
    expect(store.dialog()).toEqual({ mode: 'edit', role: ADMIN_ROLE });
  });

  it('adds a role at the end and confirms it', async () => {
    const store = createStore();
    store.openAddDialog();

    expect(await store.saveRole(DRAFT)).toBe(true);

    expect(store.roles().map((role) => role.id)).toEqual(['role-1', 'role-2', 'role-3']);
    expect(store.dialog()).toBeNull();
    expect(store.savedNotice()).toBe('add');
  });

  it('saves an edited role in place', async () => {
    const store = createStore();
    store.openRole(ADMIN_ROLE);

    await store.saveRole(DRAFT);

    expect(store.roles()[1].name).toBe('مشرف عمليات');
    expect(store.savedNotice()).toBe('edit');
  });

  it('does not save from the read-only view', async () => {
    const store = createStore();
    store.openRole(SUPER_ROLE);

    expect(await store.saveRole(DRAFT)).toBe(false);
  });

  it('deletes a role only after it is confirmed', async () => {
    const store = createStore();

    store.askToDelete(ADMIN_ROLE);
    expect(store.pendingDeletion()).toEqual(ADMIN_ROLE);
    expect(await store.confirmDeletion()).toBe(true);

    expect(store.roles()).toEqual([SUPER_ROLE]);
    expect(store.pendingDeletion()).toBeNull();
    expect(store.savedNotice()).toBe('delete');
  });

  it('closes the confirmation and keeps the reason when a delete is refused', async () => {
    const store = createStore({
      deleteRole: () => throwError(() => new Error('لا يمكن حذف دور مرتبط بمشرفين')),
    });
    store.askToDelete(ADMIN_ROLE);

    expect(await store.confirmDeletion()).toBe(false);

    expect(store.roles()).toHaveLength(2);
    expect(store.pendingDeletion()).toBeNull();
    expect(store.deleteError()).toBe('لا يمكن حذف دور مرتبط بمشرفين');
    store.clearSaveError();
    expect(store.deleteError()).toBeNull();
  });
});
