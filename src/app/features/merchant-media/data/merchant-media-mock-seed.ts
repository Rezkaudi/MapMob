import { MerchantMediaItem } from '../models/merchant-media-item';
import { MerchantMediaLibrary } from '../models/merchant-media-library';

const PHARMACY_AISLE = 'assets/images/media-pharmacy-aisle.jpg';
const MEGABYTE = 1024 * 1024;
const ADDED_AT = '2026-09-12T09:00:00.000Z';

const SEED_ITEMS: readonly MerchantMediaItem[] = [
  {
    id: 'media-1',
    kind: 'image',
    url: PHARMACY_AISLE,
    posterUrl: null,
    mimeType: 'image/jpeg',
    sizeBytes: 2.4 * MEGABYTE,
    isMain: true,
    createdAt: ADDED_AT,
  },
  {
    id: 'media-2',
    kind: 'video',
    // The mock ships no video file; the card only ever shows the poster.
    url: 'assets/videos/pharmacy-tour.mp4',
    posterUrl: PHARMACY_AISLE,
    mimeType: 'video/mp4',
    sizeBytes: 18.5 * MEGABYTE,
    isMain: false,
    createdAt: ADDED_AT,
  },
  {
    id: 'media-3',
    kind: 'image',
    url: PHARMACY_AISLE,
    posterUrl: null,
    mimeType: 'image/jpeg',
    sizeBytes: 2.4 * MEGABYTE,
    isMain: false,
    createdAt: ADDED_AT,
  },
];

/** The frame's free plan: 3 of 5 media (4 pictures and 1 video allowed). */
export function buildMerchantMediaSeed(): MerchantMediaLibrary {
  return {
    plan: { id: 'plan-free', name: 'الباقة المجانية' },
    imageLimit: 4,
    videoLimit: 1,
    items: SEED_ITEMS,
  };
}
