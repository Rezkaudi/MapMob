import { LIVE_PLACE_FORM_OPTIONS } from '../testing/live-place-choices-fixture';
import { resolvePlaceIds, toPlaceFormChoices } from './live-place-choices';

describe('live place choices', () => {
  it('reads the categories and governorates with their children', () => {
    const choices = toPlaceFormChoices({
      ...LIVE_PLACE_FORM_OPTIONS,
      deliveryPlatforms: [{ platform: 'tawseel' }],
    });

    expect(choices.mainCategories[0].subCategories).toEqual([{ id: '20', name: 'night pharmacy' }]);
    expect(choices.governorates[0].areas).toEqual([{ id: '7', name: 'tartus city' }]);
  });

  it('offers the known ordering apps by their server word, plus any app the server already uses', () => {
    const choices = toPlaceFormChoices({
      ...LIVE_PLACE_FORM_OPTIONS,
      deliveryPlatforms: [{ platform: 'tawseel' }, { platform: 'talabat' }],
    });

    expect(choices.deliveryPlatforms.map((platform) => platform.id)).toEqual([
      'talabat',
      'beeorder',
      'yallago',
      'tawseel',
    ]);
  });

  it('turns the picked names into the ids the server saves', () => {
    const choices = toPlaceFormChoices(LIVE_PLACE_FORM_OPTIONS);

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
    const choices = toPlaceFormChoices(LIVE_PLACE_FORM_OPTIONS);

    expect(
      resolvePlaceIds(choices, { mainCategory: 'x', subCategory: '', city: 'y', region: 'z' }),
    ).toEqual({ mainCategoryId: null, subCategoryId: null, governorateId: null, areaId: null });
  });
});
