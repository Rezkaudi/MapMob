import { buildDeliveryPlatform } from '../testing/delivery-platform-fixture';
import { describeDeliveryPlatform } from './delivery-platform-labels';

describe('describeDeliveryPlatform', () => {
  it('words the counts and the status as the table draws them', () => {
    expect(describeDeliveryPlatform(buildDeliveryPlatform())).toEqual({
      storeCountLabel: '124 متجر',
      referralLabel: '1,200',
      statusLabel: 'نشط',
    });
  });

  it('says one and two stores by the noun alone', () => {
    const one = describeDeliveryPlatform(buildDeliveryPlatform({ linkedStoreCount: 1 }));
    const two = describeDeliveryPlatform(buildDeliveryPlatform({ linkedStoreCount: 2 }));

    expect([one.storeCountLabel, two.storeCountLabel]).toEqual(['متجر واحد', 'متجران']);
  });
});
