import { PlacePackage } from './place-package';

/** How many pictures and videos the gallery accepts per package. */
export interface PackageMediaLimit {
  readonly images: number;
  readonly videos: number;
}

/**
 * The design states the free tier's limits of 3 pictures and 1 video; the paid tiers
 * follow the same ladder as {@link PACKAGE_PRODUCT_LIMIT}.
 */
export const PACKAGE_MEDIA_LIMIT: Record<PlacePackage, PackageMediaLimit> = {
  free: { images: 3, videos: 1 },
  basic: { images: 30, videos: 5 },
  premium: { images: 100, videos: 20 },
};
