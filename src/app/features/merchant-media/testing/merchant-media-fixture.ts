import { MerchantMediaItem } from '../models/merchant-media-item';
import { MerchantMediaLibrary } from '../models/merchant-media-library';

export function buildMediaItem(overrides: Partial<MerchantMediaItem> = {}): MerchantMediaItem {
  return {
    id: 'media-1',
    kind: 'image',
    url: 'https://cdn.example.com/media-1.jpg',
    posterUrl: null,
    mimeType: 'image/jpeg',
    sizeBytes: 2.4 * 1024 * 1024,
    isMain: false,
    createdAt: '2026-09-12T09:00:00.000Z',
    ...overrides,
  };
}

export function buildMediaVideo(overrides: Partial<MerchantMediaItem> = {}): MerchantMediaItem {
  return buildMediaItem({
    id: 'media-video',
    kind: 'video',
    url: 'https://cdn.example.com/media-video.mp4',
    posterUrl: 'https://cdn.example.com/media-video.jpg',
    mimeType: 'video/mp4',
    sizeBytes: 18.5 * 1024 * 1024,
    ...overrides,
  });
}

export function buildMediaLibrary(
  overrides: Partial<MerchantMediaLibrary> = {},
): MerchantMediaLibrary {
  return {
    plan: { id: 'plan-free', name: 'الباقة المجانية' },
    imageLimit: 4,
    videoLimit: 1,
    items: [buildMediaItem()],
    ...overrides,
  };
}
