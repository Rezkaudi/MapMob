import { KNOWN_DELIVERY_PLATFORMS } from '../models/known-delivery-platforms';
import { PlaceFormChoices } from '../models/place-form-choices';

const CATEGORY_OPTIONS: readonly string[] = ['صيدلية', 'مطعم', 'مقهى', 'سوبر ماركت', 'عيادة'];
const CITY_OPTIONS: readonly string[] = ['الرياض', 'جدة', 'الدمام', 'طرطوس'];
const REGION_OPTIONS: readonly string[] = ['المركز', 'الشمال', 'الجنوب', 'الشرق', 'الغرب'];

/** The mock form choices: every city offers every region, as the form did before the server. */
export const PLACE_MOCK_FORM_CHOICES: PlaceFormChoices = {
  mainCategories: CATEGORY_OPTIONS.map((name) => ({ id: name, name, subCategories: [] })),
  governorates: CITY_OPTIONS.map((name) => ({
    id: name,
    name,
    areas: REGION_OPTIONS.map((region) => ({ id: region, name: region })),
  })),
  deliveryPlatforms: KNOWN_DELIVERY_PLATFORMS,
};
