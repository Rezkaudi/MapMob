import { PERMISSION_MODULES, allPermissionGrants } from './permission-modules';

describe('PERMISSION_MODULES', () => {
  it('lists the fourteen sections of the matrix in the design order', () => {
    expect(PERMISSION_MODULES.map((module) => module.label)).toEqual([
      'الرئيسية والإحصائيات العامة',
      'الشركات والمتاجر',
      'التصنيفات',
      'المحافظات والمناطق',
      'المستخدمون والمشرفون',
      'التقييمات والمراجعات',
      'العروض والتخفيضات',
      'الاشتراكات والباقات',
      'المدفوعات',
      'الإحصائيات والتقارير',
      'البلاغات والشكاوى',
      'إدارة الإشعارات',
      'إدارة المحتوى والصفحات',
      'إعدادات النظام والأمان',
    ]);
  });

  it('offers only viewing on the read-only sections, and no adding on reviews or complaints', () => {
    const actionsOf = (id: string) =>
      PERMISSION_MODULES.find((module) => module.id === id)?.actions;

    expect(actionsOf('home')).toEqual(['view']);
    expect(actionsOf('payments')).toEqual(['view']);
    expect(actionsOf('reports')).toEqual(['view']);
    expect(actionsOf('reviews')).toEqual(['view', 'edit', 'delete']);
    expect(actionsOf('complaints')).toEqual(['view', 'edit', 'delete']);
    expect(actionsOf('places')).toEqual(['view', 'add', 'edit', 'delete']);
  });

  it('counts every grant the matrix can hold', () => {
    expect(allPermissionGrants()).toHaveLength(45);
    expect(allPermissionGrants()).toContain('system:delete');
  });
});
