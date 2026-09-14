import { NAV_ITEMS, SECONDARY_NAV_ITEMS } from './nav-items';

describe('nav items', () => {
  it('lists the main group in the order of the latest design', () => {
    expect(NAV_ITEMS.map((item) => item.label)).toEqual([
      'الرئيسية',
      'الشركات والمتاجر',
      'التصنيفات',
      'المحافظات والمناطق',
      'المستخدمون',
      'التقييمات و المراجعات',
      'العروض',
      'الإعلانات',
      'الاشتراكات والباقات',
      'المدفوعات',
      'الإحصائيات و التقارير',
      'إدارة المحتوى',
    ]);
  });

  it('links content management to its own page with its own icon', () => {
    expect(NAV_ITEMS.at(-1)).toEqual({
      label: 'إدارة المحتوى',
      route: '/content',
      icon: 'content',
    });
  });

  it('lists the secondary group in the order of the latest design', () => {
    expect(SECONDARY_NAV_ITEMS.map((item) => item.label)).toEqual([
      'الإشعارات',
      'البلاغات',
      'الإعدادات',
    ]);
  });
});
