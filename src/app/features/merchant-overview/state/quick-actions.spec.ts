import { MERCHANT_QUICK_ACTIONS } from './quick-actions';

describe('MERCHANT_QUICK_ACTIONS', () => {
  it('lists the cards right to left, the highlighted one first', () => {
    expect(MERCHANT_QUICK_ACTIONS.map((action) => action.title)).toEqual([
      'إضافة خدمة أو منتج',
      'إضافة عرض ترويجي',
      'إضافة صور للمتجر',
      'تعديل بيانات المتجر',
    ]);
    expect(MERCHANT_QUICK_ACTIONS.map((action) => action.isHighlighted)).toEqual([
      true,
      false,
      false,
      false,
    ]);
  });

  it('opens the merchant page each card talks about', () => {
    expect(MERCHANT_QUICK_ACTIONS.map((action) => action.route)).toEqual([
      '/merchant/products',
      '/merchant/offers',
      '/merchant/media',
      '/merchant/store',
    ]);
  });
});
