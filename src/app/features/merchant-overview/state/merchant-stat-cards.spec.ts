import { MerchantStats } from '../models/merchant-stats';
import { buildMerchantStatCards, formatChangePercent } from './merchant-stat-cards';

const STATS: MerchantStats = {
  viewCount: 2300,
  viewChangePercent: 14,
  searchAppearanceCount: 200,
  searchAppearanceChangePercent: 8,
  favoriteCount: 73,
  averageRating: 4.7,
  reviewCount: 1000,
};

describe('buildMerchantStatCards', () => {
  const cards = buildMerchantStatCards(STATS);

  it('lists the cards right to left as the design reads them', () => {
    expect(cards.map((card) => card.label)).toEqual([
      'مشاهدات متجرك',
      'مرات الظهور في البحث',
      'المفضلة',
      'متوسط التقييم',
    ]);
  });

  it('writes the values and captions from the design', () => {
    expect(cards.map((card) => card.value)).toEqual(['2300', '200', '73 مستخدم', '4.7']);
    expect(cards.map((card) => card.caption)).toEqual([
      'آخر 30 يوماً',
      'آخر 30 يوماً',
      'أضافوا متجرك إلى المفضلة',
      'مستند إلى 1000 مراجعة',
    ]);
  });

  it('shows the growth chip only on the two counts that have one', () => {
    expect(cards.map((card) => card.delta)).toEqual(['%14+', '%8+', null, null]);
  });

  it('reads "73 مستخدم" right to left, and the plain numbers left to right', () => {
    expect(cards.map((card) => card.valueDirection)).toEqual(['ltr', 'ltr', 'rtl', 'ltr']);
  });

  it('draws the icons from the design', () => {
    expect(cards.map((card) => card.icon)).toEqual([
      'eye-feather',
      'search-feather',
      'heart-feather',
      'star-feather',
    ]);
  });

  it('shows one decimal for the rating, even when it is whole', () => {
    expect(buildMerchantStatCards({ ...STATS, averageRating: 4 })[3].value).toBe('4.0');
  });
});

describe('formatChangePercent', () => {
  it('writes growth the way the design does, sign last', () => {
    expect(formatChangePercent(14)).toBe('%14+');
  });

  it('has no chip for no change or a fall, since the design only draws the green rise', () => {
    expect(formatChangePercent(0)).toBeNull();
    expect(formatChangePercent(-3)).toBeNull();
  });
});
