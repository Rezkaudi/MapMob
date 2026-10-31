import { MediaKind } from '../models/media-kind';
import { MerchantMediaItem } from '../models/merchant-media-item';
import { LiveOwnerMedia } from './live-owner-media';
import { mimeTypeOfUrl } from './mime-type-of-url';

const VIDEO_KIND: MediaKind = 'video';
const UNKNOWN_SIZE = 0;

export function toMerchantMediaItem(media: LiveOwnerMedia): MerchantMediaItem {
  const kind: MediaKind = media.type === VIDEO_KIND ? 'video' : 'image';
  return {
    id: String(media.id),
    kind,
    url: media.url,
    posterUrl: null,
    mimeType: mimeTypeOfUrl(media.url, kind),
    sizeBytes: UNKNOWN_SIZE,
    isMain: false,
    createdAt: media.createdAt,
  };
}
