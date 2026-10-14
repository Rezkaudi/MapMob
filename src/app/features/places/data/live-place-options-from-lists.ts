import { LiveCategory } from '../../categories/data/live-category';
import { LiveCity } from '../../regions/data/live-city';
import { LiveRegion } from '../../regions/data/live-region';
import { LivePlaceFormOptions } from './live-place-form-options';

/** The same choices as the store form options, built from the category, region and city lists. */
export function toLivePlaceFormOptions(
  categories: readonly LiveCategory[],
  regions: readonly LiveRegion[],
  cities: readonly LiveCity[],
): LivePlaceFormOptions {
  return {
    mainCategories: categories
      .filter((category) => category.parent_id === null)
      .map((main) => ({
        id: String(main.id),
        name: main.name,
        subCategories: categories
          .filter((category) => category.parent_id === main.id)
          .map((sub) => ({ id: String(sub.id), name: sub.name })),
      })),
    governorates: regions.map((region) => ({
      id: String(region.id),
      // The place page and list name a governorate in English, and the form matches by name.
      name: region.name.en || region.name.ar,
      areas: cities
        .filter((city) => city.region_id === region.id)
        .map((city) => ({ id: String(city.id), name: city.name })),
    })),
  };
}
