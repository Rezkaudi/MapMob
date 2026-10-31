import { MerchantMediaItem } from './merchant-media-item';

/** Everything the media page reads in one request: the plan's two limits and every file. */
export interface MerchantMediaLibrary {
  readonly plan: { readonly id: string; readonly name: string };
  /** null = no cap. */
  readonly imageLimit: number | null;
  /** null = no cap. */
  readonly videoLimit: number | null;
  /** One cap on pictures and videos together; null when only the two caps above apply. */
  readonly totalLimit: number | null;
  readonly items: readonly MerchantMediaItem[];
}
