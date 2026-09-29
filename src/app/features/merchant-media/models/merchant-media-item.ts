import { MediaKind } from './media-kind';

/** One picture or video in the place's gallery. */
export interface MerchantMediaItem {
  readonly id: string;
  readonly kind: MediaKind;
  readonly url: string;
  /** Still frame of a video; null for pictures and for videos the server has no frame of yet. */
  readonly posterUrl: string | null;
  /** e.g. "image/jpeg", shown as "JPG". */
  readonly mimeType: string;
  readonly sizeBytes: number;
  /** The picture the place card shows first. */
  readonly isMain: boolean;
  /** ISO moment, shown as "أضيف في 12 سبتمبر 2026". */
  readonly createdAt: string;
}
