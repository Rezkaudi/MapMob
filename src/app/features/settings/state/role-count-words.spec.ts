import { describeAdminCount, describePermissionCount } from './role-count-words';

describe('role count words', () => {
  it('words the number of admins in a role', () => {
    expect(describeAdminCount(0)).toBe('بدون مشرفين');
    expect(describeAdminCount(1)).toBe('مشرف واحد فقط');
    expect(describeAdminCount(2)).toBe('مشرفان');
    expect(describeAdminCount(5)).toBe('5 مشرفين');
    expect(describeAdminCount(12)).toBe('12 مشرفاً');
  });

  it('words the number of permissions, noting full access', () => {
    expect(describePermissionCount(32, false)).toBe('32 صلاحية');
    expect(describePermissionCount(5, false)).toBe('5 صلاحيات');
    expect(describePermissionCount(45, true)).toBe('45 صلاحية (كامل الصلاحيات)');
  });
});
