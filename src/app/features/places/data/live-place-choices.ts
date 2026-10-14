import { DeliveryPlatform } from '../../../shared/models/delivery-platform';
import { KNOWN_DELIVERY_PLATFORMS } from '../models/known-delivery-platforms';
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

// The server names an ordering app by one Latin word, e.g. "talabat".
function toServerWord(latinName: string): string {
  return latinName.toLowerCase().replace(/\s+/g, '');
}

function toDeliveryPlatforms(options: LivePlaceFormOptions): readonly DeliveryPlatform[] {
  const known = KNOWN_DELIVERY_PLATFORMS.map((platform) => ({
    ...platform,
    id: toServerWord(platform.latinName),
  }));
  const knownIds = new Set(known.map((platform) => platform.id));
  const extra = [...new Set((options.deliveryPlatforms ?? []).map((link) => link.platform))]
    .filter((word) => !knownIds.has(word))
    .map((word) => ({ id: word, name: word, latinName: word, logoUrl: null }));
  return [...known, ...extra];
}

export function toPlaceFormChoices(options: LivePlaceFormOptions): PlaceFormChoices {
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
    deliveryPlatforms: toDeliveryPlatforms(options),
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
