import { SETTINGS_SECTIONS } from './settings-sections';

describe('SETTINGS_SECTIONS', () => {
  it('lists the settings tabs in the order the design stacks them', () => {
    expect(SETTINGS_SECTIONS.map((section) => [section.path, section.label])).toEqual([
      ['account', 'الحساب'],
      ['platform', 'إعدادات المنصة'],
      ['notifications', 'إعدادات الإشعارات'],
      ['payments', 'إعدادات الدفع'],
      ['admins', 'مشرفوا لوحة التحكم'],
      ['roles', 'الأدوار والصلاحيات'],
    ]);
  });

  it('writes the two admin tabs at 14px, as every frame draws them, and the rest at 12px', () => {
    expect(SETTINGS_SECTIONS.map((section) => section.labelClasses)).toEqual([
      'text-[12px]/[20px]',
      'text-[12px]/[20px]',
      'text-[12px]/[20px]',
      'text-[12px]/[20px]',
      'text-[14px]/[20px]',
      'text-[14px]/[20px]',
    ]);
  });

  it('draws the bell at 20px and every other tab icon at 16px', () => {
    expect(SETTINGS_SECTIONS.map((section) => [section.icon, section.iconSize])).toEqual([
      ['settings-user', 16],
      ['settings-layout', 16],
      ['notifications', 20],
      ['payments', 16],
      ['settings-users', 16],
      ['settings-user-check', 16],
    ]);
  });
});
