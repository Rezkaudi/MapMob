import { DeliveryPlatform } from '../../../shared/models/delivery-platform';

export interface PlaceChoice {
  readonly id: string;
  readonly name: string;
}

export interface MainCategoryChoice extends PlaceChoice {
  readonly subCategories: readonly PlaceChoice[];
}

export interface GovernorateChoice extends PlaceChoice {
  readonly areas: readonly PlaceChoice[];
}

/** What the add and edit place form can pick from. */
export interface PlaceFormChoices {
  readonly mainCategories: readonly MainCategoryChoice[];
  readonly governorates: readonly GovernorateChoice[];
  /** The ordering apps a new place is offered. */
  readonly deliveryPlatforms: readonly DeliveryPlatform[];
}
