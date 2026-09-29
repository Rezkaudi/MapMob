import type { MerchantMediaItem } from '../../../merchant-media/models/merchant-media-item';
import type { MerchantMediaLibrary } from '../../../merchant-media/models/merchant-media-library';

export const OWNER_MEDIA_PICTURE = {
  id: '31',
  kind: 'image',
  url: 'https://cdn.mapmob.sy/storage/places/7/media/31.jpg',
  posterUrl: null,
  mimeType: 'image/jpeg',
  sizeBytes: 2516582,
  isMain: true,
  createdAt: '2026-09-12T09:00:00Z',
} satisfies MerchantMediaItem;

export const OWNER_MEDIA_LIBRARY = {
  plan: { id: '1', name: 'الباقة المجانية' },
  imageLimit: 4,
  videoLimit: 1,
  items: [
    OWNER_MEDIA_PICTURE,
    {
      id: '32',
      kind: 'video',
      url: 'https://cdn.mapmob.sy/storage/places/7/media/32.mp4',
      posterUrl: 'https://cdn.mapmob.sy/storage/places/7/media/32-poster.jpg',
      mimeType: 'video/mp4',
      sizeBytes: 19398656,
      isMain: false,
      createdAt: '2026-09-12T09:05:00Z',
    },
  ],
} satisfies MerchantMediaLibrary;

export const OWNER_MEDIA_FORM = {
  kind: 'image',
  file: '@front.jpg',
  isMain: true,
};

export const OWNER_MEDIA_REPLACE_FORM = {
  file: '@front-new.jpg',
};
