import { LiveDeliveryPlatform } from '../../../shared/data/live-delivery-platform';
import { toDeliveryPlatform } from '../../../shared/data/to-delivery-platform';
import { listOfferedPlatforms } from './offered-delivery-platforms';
import { PlaceChoice, PlaceFormChoices } from '../models/place-form-choices';
import { LivePlaceFormOptions } from './live-place-form-options';

export interface PlaceIds {
  readonly mainCategoryId: string | null;
  readonly subCategoryId: string | null;
  readonly governorateId: string | null;
  readonly areaId: string | null;
}

interface PickedNames {
  readonly mainCategory: string;
  readonly subCategory: string;
  readonly city: string;
  readonly region: string;
}

export function toPlaceFormChoices(
  options: LivePlaceFormOptions,
  platforms: readonly LiveDeliveryPlatform[],
): PlaceFormChoices {
  return {
    mainCategories: options.mainCategories.map((category) => ({
      id: category.id,
      name: category.name,
      subCategories: category.subCategories ?? [],
    })),
    governorates: (options.governorates ?? []).map((governorate) => ({
      id: governorate.id,
      name: governorate.name,
      areas: governorate.areas ?? [],
    })),
    deliveryPlatforms: listOfferedPlatforms(platforms).map(toDeliveryPlatform),
  };
}

function idNamed(choices: readonly PlaceChoice[] | undefined, name: string): string | null {
  return choices?.find((choice) => choice.name === name)?.id ?? null;
}

/** The form keeps names, as the place page shows them; the server saves ids. */
export function resolvePlaceIds(choices: PlaceFormChoices, names: PickedNames): PlaceIds {
  const category = choices.mainCategories.find((choice) => choice.name === names.mainCategory);
  const governorate = choices.governorates.find((choice) => choice.name === names.city);
  return {
    mainCategoryId: category?.id ?? null,
    subCategoryId: idNamed(category?.subCategories, names.subCategory),
    governorateId: governorate?.id ?? null,
    areaId: idNamed(governorate?.areas, names.region),
  };
}
