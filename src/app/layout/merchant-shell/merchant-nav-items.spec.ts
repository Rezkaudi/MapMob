import {
  MERCHANT_NAV_ITEMS,
  MERCHANT_SECONDARY_NAV_ITEMS,
  MERCHANT_USER_MENU_ITEMS,
} from './merchant-nav-items';

describe('merchant nav items', () => {
  it('lists the main group in the order of the merchant design', () => {
    expect(MERCHANT_NAV_ITEMS.map((item) => item.label)).toEqual([
      'الرئيسية',
      'بيانات المتجر',
      'المنتجات',
      'العروض',
      'الصور والوسائط',
      'التقييمات و المراجعات',
      'الاشتراكات والباقات',
    ]);
  });

  it('keeps every link inside the merchant area', () => {
    const items = [
      ...MERCHANT_NAV_ITEMS,
      ...MERCHANT_SECONDARY_NAV_ITEMS,
      ...MERCHANT_USER_MENU_ITEMS,
    ];

    expect(items.every((item) => item.route.startsWith('/merchant'))).toBe(true);
  });

  it('opens the overview at /merchant/dashboard, like the admin home', () => {
    expect(MERCHANT_NAV_ITEMS[0]).toEqual({
      label: 'الرئيسية',
      route: '/merchant/dashboard',
      icon: 'home',
    });
  });

  it('lists the secondary group below the divider', () => {
    expect(MERCHANT_SECONDARY_NAV_ITEMS.map((item) => item.label)).toEqual([
      'الإشعارات',
      'الإعدادات',
    ]);
  });
});
