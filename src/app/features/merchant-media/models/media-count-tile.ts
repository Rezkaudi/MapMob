import { MediaKind } from './media-kind';

/** One grey tile of the "توزيع الوسائط" card. */
export interface MediaCountTile {
  readonly kind: MediaKind;
  readonly label: string;
  readonly count: number;
}
