import { buildLinkedStore } from '../testing/delivery-platform-fixture';
import { buildLinkedStoreRows } from './linked-store-rows';

describe('buildLinkedStoreRows', () => {
  it('joins the governorate and the area as the frame writes them', () => {
    const [row] = buildLinkedStoreRows([buildLinkedStore()]);

    expect(row.regionLabel).toBe('طرطوس - الدريكيش');
  });

  it('shows the governorate alone when the area is not set', () => {
    const [row] = buildLinkedStoreRows([buildLinkedStore({ area: null })]);

    expect(row.regionLabel).toBe('طرطوس');
  });
});
