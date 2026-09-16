import { buildPlaceItems } from './offer-mock-items';

describe('buildPlaceItems', () => {
  it('gives each store the same eight priced items every time', () => {
    const items = buildPlaceItems('place-7');

    expect(items).toHaveLength(8);
    expect(items).toEqual(buildPlaceItems('place-7'));
    expect(items[0]).toEqual({ id: 'place-7-item-1', name: 'شامبو 1', price: 200 });
    expect(items.every((item) => item.price > 0)).toBe(true);
  });
});
