import { buildOverview } from '../testing/merchant-subscription-fixture';
import { buildUsageCards } from './usage-cards';

describe('usage cards', () => {
  const cards = buildUsageCards(buildOverview().usage);

  it('lists products, pictures, offers then ads, so RTL puts products on the right', () => {
    expect(cards.map((card) => card.title)).toEqual([
      'المنتجات والخدمات',
      'معرض الصور',
      'العروض الترويجية',
      'الإعلانات',
    ]);
  });

  it('writes each count against its limit with the frame nouns', () => {
    expect(cards.map((card) => [card.usedCount, card.limitText])).toEqual([
      [8, '/ 10 مستخدمة'],
      [15, '/ 20 صورة'],
      [2, '/ 5 عروض'],
      [2, '/ 5 إعلانات'],
    ]);
  });

  it('works out the used share', () => {
    expect(cards.map((card) => card.percentText)).toEqual(['80%', '75%', '40%', '40%']);
    expect(cards[1].usedPercent).toBe(75);
  });

  it('turns a card amber from 80% and says how little is left', () => {
    expect(cards[0].isNearLimit).toBe(true);
    expect(cards[0].note).toBe('متبقي منتجان فقط ضمن الباقة الحالية.');
    expect(cards[1].isNearLimit).toBe(false);
  });

  it("says what is left on a card with room, in each kind's own words", () => {
    expect(cards.slice(1).map((card) => card.note)).toEqual([
      'متبقي 5 صور للرفع.',
      'متبقي 3 عروض نشطة.',
      'متبقي 3 إعلانات نشطة.',
    ]);
  });

  it('flags a full card', () => {
    const [full] = buildUsageCards({
      ...buildOverview().usage,
      products: { used: 10, limit: 10 },
    });

    expect(full.usedPercent).toBe(100);
    expect(full.isNearLimit).toBe(true);
    expect(full.note).toBe('وصلت للحد الأقصى ضمن الباقة الحالية.');
  });

  it('shows no bar share for a kind the plan does not cap', () => {
    const [uncapped] = buildUsageCards({
      ...buildOverview().usage,
      products: { used: 40, limit: null },
    });

    expect(uncapped.limitText).toBe('/ غير محدود');
    expect(uncapped.usedPercent).toBe(0);
    expect(uncapped.percentText).toBe('');
    expect(uncapped.isNearLimit).toBe(false);
    expect(uncapped.note).toBe('استخدام غير محدود ضمن باقتك الحالية.');
  });

  it('keeps a count past a lowered limit at a full bar', () => {
    const [over] = buildUsageCards({
      ...buildOverview().usage,
      products: { used: 12, limit: 10 },
    });

    expect(over.usedPercent).toBe(100);
  });
});
