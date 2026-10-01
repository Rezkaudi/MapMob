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
      'القصص',
      'الاشتراكات والباقات',
      'المدفوعات',
      'منصات الطلبات و التوصيل',
      'الإحصائيات و التقارير',
      'إدارة المحتوى',
    ]);
  });

  it('links content management to its own page with its own icon', () => {
    expect(NAV_ITEMS.at(-1)).toEqual({
      label: 'إدارة المحتوى',
      route: '/admin/content',
      icon: 'content',
    });
  });

  it('links the stories to their page with the play icon, right after the ads', () => {
    const adsIndex = NAV_ITEMS.findIndex((item) => item.route === '/admin/ads');

    expect(NAV_ITEMS[adsIndex + 1]).toEqual({
      label: 'القصص',
      route: '/admin/stories',
      icon: 'play-circle',
    });
  });

  it('links the delivery platforms to their page with the truck icon', () => {
    expect(NAV_ITEMS.find((item) => item.route === '/admin/delivery-platforms')).toEqual({
      label: 'منصات الطلبات و التوصيل',
      route: '/admin/delivery-platforms',
      icon: 'delivery',
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
