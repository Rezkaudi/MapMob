import { buildSettingsMockSeed } from '../testing/settings-mock-seed-fixture';
import { AdminTeamMockRecords } from './admin-team-mock-records';

function createRecords() {
  const seed = buildSettingsMockSeed();
  return new AdminTeamMockRecords(seed.roles, seed.admins);
}

describe('AdminTeamMockRecords', () => {
  it('counts the admins of each role', () => {
    expect(
      createRecords()
        .roles()
        .map((role) => [role.id, role.adminCount]),
    ).toEqual([
      ['role-1', 1],
      ['role-2', 2],
    ]);
  });

  it('lists the admins', () => {
    expect(
      createRecords()
        .admins()
        .map((admin) => admin.id),
    ).toEqual(['admin-1', 'admin-2', 'admin-3']);
  });

  it('invites an admin into a role, active and not signed in yet', () => {
    const records = createRecords();

    const invited = records.inviteAdmin({
      fullName: 'يوسف محمد',
      email: 'Yousef.M@MapMob.com',
      roleId: 'role-1',
    });

    expect(invited).toEqual({
      id: 'admin-4',
      fullName: 'يوسف محمد',
      email: 'yousef.m@mapmob.com',
      roleId: 'role-1',
      roleName: 'مدير النظام',
      status: 'active',
      lastSignInOn: null,
    });
    expect(records.roles()[0].adminCount).toBe(2);
  });

  it('refuses an email another admin already uses, or a missing role', () => {
    const records = createRecords();

    expect(() =>
      records.inviteAdmin({ fullName: 'نسخة', email: 'YOUSEF@mapmob.com', roleId: 'role-2' }),
    ).toThrow('البريد الإلكتروني مستخدم لمشرف آخر');
    expect(() =>
      records.inviteAdmin({ fullName: 'جديد', email: 'new@mapmob.com', roleId: 'missing' }),
    ).toThrow('لم يتم العثور على الدور');
  });

  const DRAFT = {
    name: 'مشرف عمليات',
    description: 'متابعة العمليات اليومية',
    isActive: true,
    grants: ['home:view', 'places:view'],
  } as const;

  it('adds a custom role with the shield and no admins', () => {
    const records = createRecords();

    expect(records.addRole(DRAFT)).toEqual({
      id: 'role-3',
      englishName: '',
      icon: 'shield',
      isFullAccess: false,
      adminCount: 0,
      ...DRAFT,
    });
  });

  it('updates a role and renames it on its admins', () => {
    const records = createRecords();

    const updated = records.updateRole('role-2', DRAFT);

    expect(updated).toMatchObject({ id: 'role-2', name: 'مشرف عمليات', adminCount: 2 });
    expect(records.admins()[1].roleName).toBe('مشرف عمليات');
  });

  it('never changes or deletes the full access role', () => {
    const records = createRecords();

    expect(() => records.updateRole('role-1', DRAFT)).toThrow('لا يمكن تعديل دور مدير النظام');
    expect(() => records.deleteRole('role-1')).toThrow('لا يمكن حذف دور مدير النظام');
  });

  it('deletes a role only once no admin holds it', () => {
    const records = createRecords();
    const added = records.addRole(DRAFT);

    expect(() => records.deleteRole('role-2')).toThrow(
      'لا يمكن حذف دور مرتبط بمشرفين. انقل المشرفين إلى دور آخر أولاً.',
    );
    records.deleteRole(added.id);

    expect(records.roles().map((role) => role.id)).toEqual(['role-1', 'role-2']);
  });
});
