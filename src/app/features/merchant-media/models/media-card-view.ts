import { MerchantMediaItem } from './merchant-media-item';

/** What one gallery card shows. */
export interface MediaCardView {
  readonly item: MerchantMediaItem;
  readonly kindLabel: string;
  readonly isVideo: boolean;
  /** "JPG · 2.4 MB". */
  readonly fileText: string;
  /** "أضيف في 12 سبتمبر 2026". */
  readonly addedText: string;
  readonly replaceLabel: string;
  /** "image/jpeg,image/png" or "video/*", for the replace picker. */
  readonly accept: string;
}
