import { MediaKind } from './media-kind';
import { MerchantMediaItem } from './merchant-media-item';

/** Which dialog the page shows: the add form (opened on a kind) or the delete question. */
export type MediaDialogRequest =
  | { readonly kind: 'add'; readonly startKind: MediaKind }
  | { readonly kind: 'delete'; readonly item: MerchantMediaItem };
