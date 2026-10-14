import { buildLiveDeliveryPlatform } from '../../../shared/testing/live-delivery-platform-fixture';
import { buildLiveStoreDeliveryLink } from '../../../shared/testing/live-store-delivery-link-fixture';
import { toPlaceDeliveryLinks } from './live-place-delivery-links';

const TAWSEEL = buildLiveDeliveryPlatform({ id: 1, name: 'tawseel', sort_order: 2 });
const TALABAT = buildLiveDeliveryPlatform({ id: 3, name: 'talabat', sort_order: 1, logo: null });
const RETIRED = buildLiveDeliveryPlatform({ id: 4, name: 'retired', is_active: false });

describe('toPlaceDeliveryLinks', () => {
  it('lists every switched-on platform, filled from the place links', () => {
    const links = toPlaceDeliveryLinks(
      [TAWSEEL, TALABAT, RETIRED],
      [buildLiveStoreDeliveryLink({ deliveryPlatformId: '1', url: 'https://tawseel.com/52' })],
    );

    expect(links).toEqual([
      {
        platform: { id: '3', name: 'talabat', latinName: 'talabat', logoUrl: null },
        isEnabled: false,
        storeUrl: null,
      },
      {
        platform: {
          id: '1',
          name: 'tawseel',
          latinName: 'tawseel',
          logoUrl: 'https://api.test/storage/delivery-platforms/tawseel.jpg',
        },
        isEnabled: true,
        storeUrl: 'https://tawseel.com/52',
      },
    ]);
  });

  it('keeps a link to a switched-off platform, so the place does not lose it', () => {
    const links = toPlaceDeliveryLinks(
      [TAWSEEL, RETIRED],
      [buildLiveStoreDeliveryLink({ deliveryPlatformId: '4', isActive: false })],
    );

    expect(links.map((link) => [link.platform.id, link.isEnabled])).toEqual([
      ['1', false],
      ['4', false],
    ]);
  });
});
