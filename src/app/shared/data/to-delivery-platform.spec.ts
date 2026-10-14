import { buildLiveDeliveryPlatform } from '../testing/live-delivery-platform-fixture';
import { toDeliveryPlatform } from './to-delivery-platform';

describe('toDeliveryPlatform', () => {
  it('uses the one name the server sends for both names', () => {
    expect(toDeliveryPlatform(buildLiveDeliveryPlatform())).toEqual({
      id: '1',
      name: 'tawseel',
      latinName: 'tawseel',
      logoUrl: 'https://api.test/storage/delivery-platforms/tawseel.jpg',
    });
  });
});
