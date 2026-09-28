import { buildMerchantProduct } from '../testing/merchant-product-fixture';
import { toProductTableRow } from './product-table-rows';

const NOW = new Date('2026-09-28T12:00:00.000Z');

describe('toProductTableRow', () => {
  it('prints the price with its sign, the change in weeks and the status', () => {
    const product = buildMerchantProduct({ updatedAt: '2026-09-21T12:00:00.000Z' });

    expect(toProductTableRow(product, NOW)).toEqual({
      product,
      initial: 'م',
      priceText: '200 ل.س',
      updatedText: 'منذ أسبوع',
      status: 'active',
      statusLabel: 'متاح',
    });
  });

  it('shows an unavailable product in red as "غير متاح"', () => {
    const row = toProductTableRow(buildMerchantProduct({ isAvailable: false }), NOW);

    expect(row.status).toBe('suspended');
    expect(row.statusLabel).toBe('غير متاح');
  });

  it('takes the first letter after any leading spaces, and prices dollars with "$"', () => {
    const row = toProductTableRow(
      buildMerchantProduct({ name: '  جل شعر', price: 1500, currency: 'USD' }),
      NOW,
    );

    expect(row.initial).toBe('ج');
    expect(row.priceText).toBe('1,500 $');
  });
});
