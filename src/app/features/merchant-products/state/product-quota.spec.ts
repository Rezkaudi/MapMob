import { describeProductQuota } from './product-quota';

describe('describeProductQuota', () => {
  it('counts in products, the way the usage card writes it', () => {
    expect(describeProductQuota(3, 5)).toEqual(
      expect.objectContaining({
        limitText: '/ 5 منتجات',
        remainingChipText: 'متبقي لك منتجان',
        notice: 'متبقي لك منتجان ضمن باقتك الحالية قبل الوصول للحد المتاح.',
      }),
    );
    expect(describeProductQuota(2, 50).limitText).toBe('/ 50 منتجاً');
    expect(describeProductQuota(4, 5).remainingChipText).toBe('متبقي لك منتج واحد');
  });

  it('says products and services are not capped on a plan with no limit', () => {
    expect(describeProductQuota(12, null).notice).toBe(
      'باقتك الحالية لا تحدّ عدد المنتجات والخدمات.',
    );
  });
});
