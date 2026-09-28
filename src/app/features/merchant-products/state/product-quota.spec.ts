import { describeProductQuota } from './product-quota';

describe('describeProductQuota', () => {
  it('describes 3 of 5 used the way the usage card writes it', () => {
    expect(describeProductQuota(3, 5)).toEqual({
      usedCount: 3,
      limitText: '/ 5 منتجات',
      usedPercent: 60,
      isFull: false,
      remainingChipText: 'متبقي لك منتجان',
      remainingChipTone: 'success',
      notice: 'متبقي لك منتجان ضمن باقتك الحالية قبل الوصول للحد المتاح.',
    });
  });

  it('uses the plural with the digit from three up', () => {
    expect(describeProductQuota(2, 10).remainingChipText).toBe('متبقي لك 8 منتجات');
    expect(describeProductQuota(2, 50).limitText).toBe('/ 50 منتجاً');
  });

  it('says one product is left in the singular', () => {
    expect(describeProductQuota(4, 5).remainingChipText).toBe('متبقي لك منتج واحد');
  });

  it('marks the plan full, in red, once the limit is reached or passed', () => {
    const full = describeProductQuota(6, 5);

    expect(full.isFull).toBe(true);
    expect(full.usedPercent).toBe(100);
    expect(full.remainingChipText).toBe('وصلت للحد المتاح');
    expect(full.remainingChipTone).toBe('error');
    expect(full.notice).toBe('وصلت للحد المتاح في باقتك الحالية. رقِّ باقتك لإضافة المزيد.');
  });

  it('treats a plan with no products allowed as full rather than dividing by zero', () => {
    expect(describeProductQuota(0, 0)).toEqual(
      expect.objectContaining({ usedPercent: 100, isFull: true }),
    );
  });

  it('describes a plan with no cap (a null limit) as never full', () => {
    expect(describeProductQuota(12, null)).toEqual({
      usedCount: 12,
      limitText: '/ بلا حد',
      usedPercent: 0,
      isFull: false,
      remainingChipText: 'عدد غير محدود',
      remainingChipTone: 'success',
      notice: 'باقتك الحالية لا تحدّ عدد المنتجات والخدمات.',
    });
  });
});
