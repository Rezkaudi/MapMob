import { buildGame, buildWinner } from '../testing/game-fixture';
import { buildDeleteGameCopy, buildDeliveryChangeCopy } from './game-confirm-copy';

describe('game confirm copy', () => {
  it('asks before deleting a game and names it with its start', () => {
    const copy = buildDeleteGameCopy(buildGame());
    expect(copy.title).toBe('حذف اللعبة');
    expect(copy.confirmLabel).toBe('حذف اللعبة');
    expect(copy.tone).toBe('critical');
    expect(copy.context?.lines).toEqual([
      'الأكثرية والأقلية — الجولة #104',
      '15 أكتوبر 2026 — 18:00',
    ]);
  });

  it('marks a waiting prize as delivered', () => {
    const copy = buildDeliveryChangeCopy(buildWinner({ deliveryStatus: 'pending' }));
    expect(copy.title).toBe('تأكيد تسليم الجائزة');
    expect(copy.confirmLabel).toBe('تم التسليم');
    expect(copy.tone).toBe('success');
    expect(copy.context?.tag).toBe('الحالة: بانتظار التسليم');
  });

  it('puts a delivered prize back to waiting', () => {
    const copy = buildDeliveryChangeCopy(buildWinner({ deliveryStatus: 'delivered' }));
    expect(copy.title).toBe('إلغاء تسليم الجائزة');
    expect(copy.confirmLabel).toBe('بانتظار التسليم');
    expect(copy.tone).toBe('warning');
  });
});
