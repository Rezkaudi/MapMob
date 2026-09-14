import { PlacePackage } from './place-package';

/**
 * How many products or services each package allows. The design states the free
 * tier's limit of 3; the paid tiers follow the same ladder as the packages.
 */
export const PACKAGE_PRODUCT_LIMIT: Record<PlacePackage, number> = {
  free: 3,
  basic: 10,
  premium: 50,
};
