import { buildLiveDeliveryPlatform } from '../../../shared/testing/live-delivery-platform-fixture';
import { LIVE_PLACE_FORM_OPTIONS } from '../testing/live-place-choices-fixture';
import { resolvePlaceIds, toPlaceFormChoices } from './live-place-choices';

describe('live place choices', () => {
  it('reads the categories and governorates with their children', () => {
    const choices = toPlaceFormChoices(LIVE_PLACE_FORM_OPTIONS, []);

    expect(choices.mainCategories[0].subCategories).toEqual([{ id: '20', name: 'night pharmacy' }]);
    expect(choices.governorates[0].areas).toEqual([{ id: '7', name: 'tartus city' }]);
  });

  it('offers the switched-on platforms of the admin list, in their display order', () => {
    const choices = toPlaceFormChoices(LIVE_PLACE_FORM_OPTIONS, [
      buildLiveDeliveryPlatform({ id: 1, name: 'tawseel', sort_order: 2 }),
      buildLiveDeliveryPlatform({ id: 2, name: 'off', is_active: false }),
      buildLiveDeliveryPlatform({ id: 3, name: 'talabat', sort_order: 1 }),
    ]);

    expect(choices.deliveryPlatforms.map((platform) => platform.id)).toEqual(['3', '1']);
  });

  it('turns the picked names into the ids the server saves', () => {
    const choices = toPlaceFormChoices(LIVE_PLACE_FORM_OPTIONS, []);

    expect(
      resolvePlaceIds(choices, {
        mainCategory: 'pharmacy',
        subCategory: 'night pharmacy',
        city: 'tartous Governorate',
        region: 'tartus city',
      }),
    ).toEqual({ mainCategoryId: '8', subCategoryId: '20', governorateId: '6', areaId: '7' });
  });

  it('leaves out what it cannot find', () => {
    const choices = toPlaceFormChoices(LIVE_PLACE_FORM_OPTIONS, []);

    expect(
      resolvePlaceIds(choices, { mainCategory: 'x', subCategory: '', city: 'y', region: 'z' }),
    ).toEqual({ mainCategoryId: null, subCategoryId: null, governorateId: null, areaId: null });
  });
});
