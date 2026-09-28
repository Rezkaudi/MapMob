import { QuotaNouns } from '../models/quota-nouns';
import { describePlanQuota } from './plan-quota';

const OFFER_NOUNS: QuotaNouns = {
  limitWords: { one: 'عرض', two: 'عرضين', few: 'عروض', many: 'عرضاً' },
  remainingWords: { one: 'عرض واحد', two: 'عرضان', few: 'عروض', many: 'عرضاً' },
  uncappedNotice: 'باقتك الحالية لا تحدّ عدد العروض النشطة.',
};

describe('describePlanQuota', () => {
  it('describes 3 of 5 used with the nouns it is given', () => {
    expect(describePlanQuota(3, 5, OFFER_NOUNS)).toEqual({
      usedCount: 3,
      limitText: '/ 5 عروض',
      usedPercent: 60,
      isFull: false,
      remainingChipText: 'متبقي لك عرضان',
      remainingChipTone: 'success',
      notice: 'متبقي لك عرضان ضمن باقتك الحالية قبل الوصول للحد المتاح.',
    });
  });

  it('uses the plural with the digit from three up', () => {
    expect(describePlanQuota(2, 10, OFFER_NOUNS).remainingChipText).toBe('متبقي لك 8 عروض');
    expect(describePlanQuota(2, 50, OFFER_NOUNS).limitText).toBe('/ 50 عرضاً');
  });

  it('says one is left in the singular', () => {
    expect(describePlanQuota(4, 5, OFFER_NOUNS).remainingChipText).toBe('متبقي لك عرض واحد');
  });

  it('marks the plan full, in red, once the limit is reached or passed', () => {
    const full = describePlanQuota(6, 5, OFFER_NOUNS);

    expect(full.isFull).toBe(true);
    expect(full.usedPercent).toBe(100);
    expect(full.remainingChipText).toBe('وصلت للحد المتاح');
    expect(full.remainingChipTone).toBe('error');
    expect(full.notice).toBe('وصلت للحد المتاح في باقتك الحالية. رقِّ باقتك لإضافة المزيد.');
  });

  it('treats a plan that allows none as full rather than dividing by zero', () => {
    expect(describePlanQuota(0, 0, OFFER_NOUNS)).toEqual(
      expect.objectContaining({ usedPercent: 100, isFull: true }),
    );
  });

  it('describes a plan with no cap (a null limit) as never full', () => {
    expect(describePlanQuota(12, null, OFFER_NOUNS)).toEqual({
      usedCount: 12,
      limitText: '/ بلا حد',
      usedPercent: 0,
      isFull: false,
      remainingChipText: 'عدد غير محدود',
      remainingChipTone: 'success',
      notice: 'باقتك الحالية لا تحدّ عدد العروض النشطة.',
    });
  });
});
