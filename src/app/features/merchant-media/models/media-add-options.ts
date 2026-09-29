import { MediaKind } from './media-kind';

/** What the "إضافة وسائط" dialog opens with. */
export interface MediaAddOptions {
  readonly startKind: MediaKind;
  readonly canAddImage: boolean;
  readonly canAddVideo: boolean;
  readonly notice: string;
}
